import * as React from 'react';

import ConfigurationInput from '../../atoms/configuration-input/Component';
import blockIcon from '../../../styles/svg/block.svg';
import calendarIcon from '../../../styles/svg/calendar.svg';
import crosshairIcon from '../../../styles/svg/crosshair.svg';
import distanceIcon from '../../../styles/svg/distance.svg';
import wifiIcon from '../../../styles/svg/wifi.svg';
import serverIcon from '../../../styles/svg/server.svg';
import transactionSizeIcon from '../../../styles/svg/transactionSize.svg';
import transactionsPerBlockIcon from '../../../styles/svg/transactionsPerBlock.svg';
import { ConfigurationKey, IConfiguration, ISvg } from '../../../common/types';

interface IConfigurationPlateProps {
  onConfigurationChange: (configuration: IConfiguration) => void;
  configuration: IConfiguration;
}

interface IGridInput {
  configurationKey: ConfigurationKey;
  placeholder: string;
  icon: ISvg;
  title: string;
}

export default class ConfigurationPlate extends React.Component<IConfigurationPlateProps, {}> {
  private gridInputs: IGridInput[] = [
    {
      configurationKey: 'numberOfNodes',
      icon: serverIcon,
      placeholder: 'Number of nodes',
      title: 'Number of nodes',
    },
    {
      configurationKey: 'numberOfNeighbours',
      icon: crosshairIcon,
      placeholder: 'Number of neighbours',
      title: 'Number of neighbours',
    },
    {
      configurationKey: 'blockTime',
      icon: blockIcon,
      placeholder: 'Block time',
      title: 'Time it takes to mine a block (in seconds)',
    },
    {
      configurationKey: 'transactionSize',
      icon: transactionSizeIcon,
      placeholder: 'Transaction size',
      title: 'Transaction size in KBs',
    },
    {
      configurationKey: 'throughput',
      icon: transactionsPerBlockIcon,
      placeholder: 'Throughput',
      title: 'Number of transactions per blockTime / throughput',
    },
    {
      configurationKey: 'latency',
      icon: distanceIcon,
      placeholder: 'Latency',
      title: 'Propagation delay for a block (in milliseconds)',
    },
    {
      configurationKey: 'neighboursDiscoveryInterval',
      icon: wifiIcon,
      placeholder: 'Neighbours Discovery Interval',
      title: 'Neighbours Discovery Interval (in seconds)',
    },
  ];

  constructor(props: IConfigurationPlateProps) {
    super(props);
    this.handleConfigurationChange = this.handleConfigurationChange.bind(this);
  }

  public render() {
    const { configuration } = this.props;

    return (
      <div className="configuration-plate u-plate">
        <div className="configuration-plate__title">
          Configure Options
        </div>
        <div className="configuration-plate__content">
          <div className="configuration-plate__grid">
            {this.gridInputs.map(item =>
              <ConfigurationInput
                key={item.configurationKey}
                placeholder={item.placeholder}
                type="number"
                configurationKey={item.configurationKey}
                onConfigurationChange={this.handleConfigurationChange}
                icon={item.icon}
                value={configuration[item.configurationKey]}
                title={item.title}
              />,
            )}
            <ConfigurationInput
              placeholder="Simulate until"
              type="datetime-local"
              configurationKey="simulateUntil"
              onConfigurationChange={this.handleConfigurationChange}
              icon={calendarIcon}
              value={configuration.simulateUntil}
              title="Simulate until"
            />
          </div>
        </div>
      </div>
    );
  }

  private handleConfigurationChange(configurationKey: ConfigurationKey, value: number) {
    const { configuration, onConfigurationChange } = this.props;
    const newConfiguration = { ...configuration };
    newConfiguration[configurationKey] = value;

    onConfigurationChange({
      ...configuration,
      ...newConfiguration,
    });
  }
}