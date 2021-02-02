import React from 'react';
import { Button, Card, Grid, Message, Modal, Form, Label } from 'semantic-ui-react';

import KittyAvatar from './KittyAvatar';
import { TxButton } from '../../substrate-lib/components';

// --- About Modal --- 
// kitty trasfer card
const TransferModal = props => {
  const { kitty, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});
  const [amount, setAmount] = React.useState(0);

  const formChange = key => (ev, el) => {
    /* TODO: 加代码 */
    setFormValue(prev => ({ ...prev, [key]: el.value }));
    setAmount(10000000);
  };

  const confirmAndClose = (unsub) => {
    unsub();
    setOpen(false);
  };

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>转让</Button>}>
    <Modal.Header>毛孩转让</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='毛孩 ID' readOnly value={kitty.id}/>
      <Form.Input fluid label='转让对象' placeholder='对方地址' onChange={formChange('target')}/>
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>取消</Button>
      <TxButton
        accountPair={accountPair} label='确认转让' type='SIGNED-TX' setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'hellokittysModule',
          callable: 'transfer',
          inputParams: [formValue.target, kitty.id,amount],
          paramFields: [true, true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};

 // --- About Kitty Card ---
function stringToByte(str) {
  const bytes = [];
  let len, c;
  len = str.length;
  for(var i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if(c >= 0x010000 && c <= 0x10FFFF) {
          bytes.push(((c >> 18) & 0x07) | 0xF0);
          bytes.push(((c >> 12) & 0x3F) | 0x80);
          bytes.push(((c >> 6) & 0x3F) | 0x80);
          bytes.push((c & 0x3F) | 0x80);
      } else if(c >= 0x000800 && c <= 0x00FFFF) {
          bytes.push(((c >> 12) & 0x0F) | 0xE0);
          bytes.push(((c >> 6) & 0x3F) | 0x80);
          bytes.push((c & 0x3F) | 0x80);
      } else if(c >= 0x000080 && c <= 0x0007FF) {
          bytes.push(((c >> 6) & 0x1F) | 0xC0);
          bytes.push((c & 0x3F) | 0x80);
      } else {
          bytes.push(c & 0xFF);
      }
  }
  return bytes;
}

// my kitty card
const KittyCard = props => {
  /*
    : 加代码。这里会 UI 显示一张 `KittyCard` 是怎么样的。这里会用到：
    ```
    <KittyAvatar dna={dna} /> - 来描绘一只猫咪的信息
    ```
  */
  const { kitty,amount,accountPair, setStatus} = props;
  const { id = null, dna = null, owner = null, price = null } = kitty;
  const dna_str = dna.toString();
  const dna_arr = stringToByte(dna_str.slice(2, dna_str.length));
  const owner_str = "" + owner;
  const price_str = "" + price;
  const displayId = id === null ? '' : (id < 10 ? `0${id}` : id.toString());

  let message = "";
  let is_owner = accountPair.address === owner_str;
  if (is_owner) {
      message += "[属于本人]";
  }
  if (price_str !== "") {
      message += " | 价格设置为: " + price_str;
  }
  return (
    <Grid.Column width={4}>
      
        <Card>
            <Card.Content>
                <Card.Header>ID编号: {displayId}</Card.Header>
                { is_owner={is_owner} && <Label as='a' floating color='teal'>我的</Label> }
                <KittyAvatar dna={dna_arr} />
                <TransferModal extra style={{ textAlign: 'center' }} kitty={kitty} is_owner={is_owner} accountPair={accountPair} setStatus={setStatus}/>
                <Card.Content>
                  <Card.Meta style={{ overflowWrap: 'break-word' }}>
                     基因: <br/>
                    {dna_str}
                  </Card.Meta>
                  <Card.Description>
                    <p style={{ overflowWrap: 'break-word' }}>
                      猫奴:<br/>
                      {accountPair.address}
                    </p>
                      价格:<br/>
                    <p>{price_str?price_str:0}</p>
                    {/* <p>{message}</p> */}
                  </Card.Description>
                </Card.Content>
            </Card.Content>
        </Card>
    </Grid.Column>
  );
};

// all kitty show card
const KittyCards = props => {
  const { kitties, kittyOwners, kittyPrices, accountPair, setStatus } = props;
  if (kitties.length === 0) {
    return <Message info>
      <Message.Header>现在连一只毛孩都木有，赶快创建一只&nbsp;
        <span role='img' aria-label='point-down'>👇</span>
      </Message.Header>
    </Message>;
  }
  /* TODO: 加代码。这里会枚举所有的 `KittyCard` */
  return (
    <Grid>
        {kitties.map((kitty, index) => <KittyCard key={index} kitty={kitty} owner={kittyOwners[index]} price={kittyPrices[index]} accountPair={accountPair} setStatus={setStatus}/>)}
    </Grid>
  );
};


// kitty trasfer card
// const TransferModal = props => {
//   const { kitty, accountPair, setStatus } = props;
//   const [open, setOpen] = React.useState(false);
//   const [formValue, setFormValue] = React.useState({});

//   const formChange = key => (ev, el) => {
//     setFormValue({ ...formValue, [key]: el.value });
//   };

//   const confirmAndClose = (unsub) => {
//     unsub();
//     setOpen(false);
//   };

//   return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
//     trigger={<Button basic color='blue'>转让</Button>}>
//     <Modal.Header>毛孩转让</Modal.Header>
//     <Modal.Content><Form>
//       <Form.Input fluid label='毛孩 ID' readOnly value={kitty.id}/>
//       <Form.Input fluid label='转让对象' placeholder='对方地址' onChange={formChange('target')}/>
//     </Form></Modal.Content>
//     <Modal.Actions>
//       <Button basic color='grey' onClick={() => setOpen(false)}>取消</Button>
//       <TxButton
//         accountPair={accountPair} label='确认转让' type='SIGNED-TX' setStatus={setStatus}
//         onClick={confirmAndClose}
//         attrs={{
//           palletRpc: 'hellokittysModule',
//           callable: 'transfer',
//           inputParams: [formValue.target, kitty.id],
//           paramFields: [true, true]
//         }}
//       />
//     </Modal.Actions>
//   </Modal>;
// };

// //--- About Kitty Card ---

// const KittyCard = props => {
//   const { kitty, accountPair, setStatus } = props;
//   const { id = null, dna = null, owner = null, price = null } = kitty;
//   const dna_str = dna.toString();
//   const displayDna = stringToByte(dna_str.slice(2, dna_str.length));
//   // const displayDna = dna && dna.join(',');
//   const displayPrice = price || '不出售';
//   const displayId = id === null ? '' : (id < 10 ? `0${id}` : id.toString());
//   const isSelf = accountPair.address === kitty.owner;

//   return <Card>
//     { isSelf && <Label as='a' floating color='teal'>我的</Label> }
//     <KittyAvatar dna={dna} />
//     <Card.Content>
//       <Card.Header>ID 号: {displayId}</Card.Header>
//       <Card.Meta style={{ overflowWrap: 'break-word' }}>
//         基因: <br/>
//         {displayDna}
//       </Card.Meta>
//       <Card.Description>
//         <p style={{ overflowWrap: 'break-word' }}>
//           猫奴:<br/>
//           {owner}
//         </p>
//         <p>{displayPrice}</p>
//       </Card.Description>
//     </Card.Content>
//     <Card.Content extra style={{ textAlign: 'center' }}>{ owner === accountPair.address
//       ? <TransferModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
//       : ''
//     }</Card.Content>
//   </Card>;
// };

// const KittyCards = props => {
//   const { kitties,kittyOwners,kittyPrices, accountPair, setStatus } = props;

//   if (kitties.length === 0) {
//     return <Message info>
//       <Message.Header>现在连一只毛孩都木有，赶快创建一只&nbsp;
//         <span role='img' aria-label='point-down'>👇</span>
//       </Message.Header>
//     </Message>;
//   }
  
//   return <Grid columns={3}>{kitties.map((kitty, index) =>
//     <Grid.Column key={`kitty-${index}`}>
//       {/* <KittyCard kitty={kitty} accountPair={accountPair} setStatus={setStatus}/> */}
//        <KittyCard key={index} kitty={kitty} owner={kittyOwners[index]} price={kittyPrices[index]} accountPair={accountPair} setStatus={setStatus}/>
//     </Grid.Column>
//   )}</Grid>;
// };


export default KittyCards;