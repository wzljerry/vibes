package com.vibes.models

import java.util.UUID

import com.vibes.utils.VConf
import org.joda.time.{DateTime, Duration}

import scala.collection.mutable.ListBuffer

case class VBlock(
  id: String,
  origin: VNode,
  transactions: Set[VTransaction],
  level: Int,
  timestamp: DateTime,
  private val recipients: ListBuffer[VRecipient],
) {
  def numberOfRecipients: Int = recipients.size

  def copy(
    id: String = id,
    origin: VNode = origin,
    transactions: Set[VTransaction] = transactions,
    level: Int = level,
    timestamp: DateTime = timestamp,
    recipients: ListBuffer[VRecipient] = recipients,
  ): VBlock = {
    new VBlock(id, origin, transactions, level, timestamp, recipients)
  }
  def currentRecipients: List[VRecipient] = recipients.toList

  def containsRecipient(recipient: VNode): Boolean = {
    recipients.map(_.to.actor).contains(recipient.actor)
  }
  // This assumes that recipients of a block are always nonEmpty, which is currently the case
  // since block is created only via createWinnerBlock for now
  def addRecipient(from: VNode, to: VNode, timestamp: DateTime): VBlock = {
    assert(!containsRecipient(to))

    if (to.actor != origin.actor) {
      recipients += VRecipient(from, to, timestamp)
    }

    copy()
  }

  def calculatePropagationTimes(): (Option[Float], Option[Float], Option[Float]) = {
    // -1 cause we don't count origin
    val n1 = Math.floor((VConf.numberOfNodes - 1) * 0.01).toInt
    val n2 = Math.floor((VConf.numberOfNodes - 1) * 0.5).toInt
    val n3 = Math.floor((VConf.numberOfNodes - 1) * 0.90).toInt
    import com.vibes.utils.Joda._

    val sortedRecipients = recipients.sortBy(_.timestamp)

    val t0                = sortedRecipients.head.timestamp
    var t1: Option[Float] = None
    var t2: Option[Float] = None
    var t3: Option[Float] = None

    if (sortedRecipients.lengthCompare(n1) > 0) {
      t1 = Some(new Duration(t0, sortedRecipients(n1).timestamp).toDuration.getMillis.toFloat / 1000)
    }

    if (sortedRecipients.lengthCompare(n2) > 0) {
      t2 = Some(new Duration(t0, sortedRecipients(n2).timestamp).toDuration.getMillis.toFloat / 1000)
    }

    if (sortedRecipients.lengthCompare(n3) > 0) {
      t3 = Some(new Duration(t0, sortedRecipients(n3).timestamp).toDuration.getMillis.toFloat / 1000)
    }

    (t1, t2, t3)
  }
}

object VBlock {
  def createWinnerBlock(node: VNode, timestamp: DateTime): VBlock = {
    VBlock(
      id = UUID.randomUUID().toString,
      origin = node,
      transactions = node.transactionPool,
      level = node.blockchain.size,
      timestamp = timestamp,
      recipients = ListBuffer.empty
    )
  }
}