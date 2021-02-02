import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from '../../substrate-lib';
import { TxButton } from '../../substrate-lib/components';

import KittyCards from './KittyCards';

export default function Kitties (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [kittyCnt, setKittyCnt] = useState(0);
  const [kittyDNAs, setKittyDNAs] = useState([]);
  const [kittyOwners, setKittyOwners] = useState([]);
  const [kittyPrices, setKittyPrices] = useState([]);
  const [kitties, setKitties] = useState([]);
  const [status, setStatus] = useState('');
  // 设置kitty费用
  const [amount, setAmount] = useState(0);

  const fetchKittyCnt = () => {
    api.query.hellokittysModule.kittiesCount(cnt => {
      const cntNum = cnt.toNumber();
      setKittyCnt(cntNum);
    });
  };
  // 异步加载数据
  const fetchKitties = () => {
    let unsubDnas = null;
    let unsubOwners = null;
    let unsubPrices = null;

    const asyncFetch = async () => {
      const kittyIndices = [...Array(kittyCnt).keys()];

      unsubDnas = await api.query.hellokittysModule.kitties.multi(
        kittyIndices,
        dnas => setKittyDNAs(dnas.map(dna => dna.value.toU8a()))
      );

      unsubOwners = await api.query.hellokittysModule.kittyOwners.multi(
        kittyIndices,
        owners => setKittyOwners(owners.map(owner => owner.toHuman()))
      );

      unsubPrices = await api.query.hellokittysModule.kittyPrices.multi(
        kittyIndices,
        prices => setKittyPrices(prices.map(price => price.isSome && price.toHuman()))
      );
    };

    asyncFetch();

    // return the unsubscription cleanup function
    return () => {
      unsubDnas && unsubDnas();
      unsubOwners && unsubOwners();
      unsubPrices && unsubPrices();
    };
  };

  const populateKitties = () => {
    const kittyIndices = [...Array(kittyCnt).keys()];
    const kitties = kittyIndices.map(ind => ({
      id: ind,
      dna: kittyDNAs[ind],
      owner: kittyOwners[ind],
      price: kittyPrices[ind]
    }));
    setKitties(kitties);
  };

  useEffect(fetchKittyCnt, [api, keyring]);
  useEffect(fetchKitties, [api, kittyCnt]);
  useEffect(populateKitties, [kittyDNAs, kittyOwners]);

  return <Grid.Column width={16}>
    <h1>小毛孩</h1>
    <p>总毛孩个数为: {kittyCnt}</p>
    <KittyCards kitties={kitties} kittyOwners={kittyOwners} kittyPrices={kittyPrices} accountPair={accountPair} setStatus={setStatus}/>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='创建小毛孩' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'hellokittysModule',
            callable: 'create',
            inputParams: [amount],
            paramFields: [true]
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
  // TODO 繁殖kitty
  // TODO 设置kitty价格
  // TODO 购买操作
  // TODO 抵押操作
}
