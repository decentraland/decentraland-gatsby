// import React from 'react'
// import { storiesOf } from "@storybook/react";

// import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid'
// import Divider from '../Text/Divider';
// import ImgFixed from './ImgFixed'
// import Title from '../Text/Title';
// import Code from '../Text/Code';
// import { Container } from 'decentraland-ui/dist/components/Container/Container';
// import Paragraph from '../Text/Paragraph';
// import SubTitle from '../Text/SubTitle';

// storiesOf('Images', module)

//   .add('ImgFixed', () => {
//     return <Container>
//       <Divider />
//       <Title><Code inline>ImgFixed</Code> component:  </Title>
//       <Paragraph secondary>Allow you insert an image with a constant relation between width and height</Paragraph>
//       <Divider size="small" line />
//       <SubTitle>Dimensions</SubTitle>
//       <Grid>
//         <Grid.Row>
//           <Grid.Column mobile="4">
//             <Code inline>dimension="wide"</Code>
//             <ImgFixed dimension="wide" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
//           </Grid.Column>
//           <Grid.Column mobile="4">
//             <Code inline>dimension="square"</Code>
//             <ImgFixed dimension="square" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
//           </Grid.Column>
//           <Grid.Column mobile="4">
//             <Code inline>dimension="circle"</Code>
//             <ImgFixed dimension="circle" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
//           </Grid.Column>
//           <Grid.Column mobile="4">
//             <Code inline>dimension="vertical"</Code>
//             <ImgFixed dimension="vertical" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
//           </Grid.Column>
//         </Grid.Row >
//       </Grid >
//       <Divider size="small" line />
//       <SubTitle>Sizes</SubTitle>
//       <Grid>
//         <Grid.Row>
//           <Grid.Column mobile="5">
//             <Code inline>size="initial"</Code>
//             <ImgFixed size="initial" dimension="wide" background="#222" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
//           </Grid.Column>
//           <Grid.Column mobile="5">
//             <Code inline>size="cover"</Code>
//             <ImgFixed size="cover" dimension="wide" background="#222" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
//           </Grid.Column>
//           <Grid.Column mobile="5">
//             <Code inline>size="contain"</Code>
//             <ImgFixed size="contain" dimension="wide" background="#222" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
//           </Grid.Column>
//         </Grid.Row>
//         <Grid.Row>
//           <Grid.Column mobile="5">
//             <Code inline>size="75%"</Code>
//             <ImgFixed size="75%" dimension="wide" background="#222" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
//           </Grid.Column>
//           <Grid.Column mobile="5">
//             <Code inline>size="50%"</Code>
//             <ImgFixed size="50%" dimension="wide" background="#222" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
//           </Grid.Column>
//           <Grid.Column mobile="5">
//             <Code inline>size="25%"</Code>
//             <ImgFixed size="25%" dimension="wide" background="#222" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
//           </Grid.Column>
//         </Grid.Row>
//       </Grid >
//       <Divider />
//     </Container >
//   })