// import React from 'react'
// import { storiesOf } from "@storybook/react";


// import Divider from '../Text/Divider';
// import Title from '../Text/Title';
// import Code from '../Text/Code';
// import Paragraph from '../Text/Paragraph';
// import Link from '../Text/Link';
// import { Container } from 'decentraland-ui/dist/components/Container/Container';
// import { Hero } from 'decentraland-ui/dist/components/Hero/Hero';

// import Background from './Background'
// import Image from './Image'
// import DAOBackground from './Custom/DAOBackground'

// const logo = require('../../../static/decentraland.svg')

// storiesOf('Hero', module)

//   .add('Background', () => {
//     return <Container>
//       <Divider />
//       <Title><Code inline>Background</Code> component:  </Title>
//       <Paragraph secondary>Define a background cover for a <Code inline>Hero</Code> Component</Paragraph>
//       <Divider size="small" line />

//       <Code language="tsx">{`<Background src="https://landing-org-1i93wf07p.now.sh/static/back....png" />`}</Code>
//       <div style={{ height: '500px' }}>
//         <Hero>
//           <Hero.Content>
//             <Background src="https://landing-org-1i93wf07p.now.sh/static/background-trade-0488aa3a3e99678f3df7e5b11ae01968.png" />
//           </Hero.Content>
//         </Hero>
//       </div>
//       <Divider />
//     </Container>
//   })
//   .add('Image', () => {
//     return <Container>
//       <Divider />
//       <Title><Code inline>Image</Code> component:  </Title>
//       <Paragraph secondary>Extend a <Link href="https://www.framer.com/motion/">Motion</Link> component as an image for <Code inline>Hero</Code> Component.</Paragraph>
//       <Divider size="small" line />

//       <Code language="tsx">{`<Image src="https://landing-org-1i93wf07p.now.sh/static/back....png" />`}</Code>
//       <Paragraph>
//         <Link href="https://www.framer.com/motion/#features">{'Explore features >'}</Link>
//         <br />
//         <Link href="https://www.framer.com/api/motion/">{'Full motion documentation >'}</Link>
//       </Paragraph>
//       <div style={{ height: '500px' }}>
//         <Hero>
//           <Hero.Content>
//             <Background src="https://landing-org-1i93wf07p.now.sh/static/background-trade-0488aa3a3e99678f3df7e5b11ae01968.png" />
//             <Image src={logo}
//               style={{ width: '100px', height: '100px', top: 'calc(50% - 50px)', left: 'calc(50% - 50px)', cursor: 'pointer' }}
//               animate={{ scale: 0.5, opacity: 0.5 }}
//               transition={{
//                 yoyo: Infinity,
//                 duration: 1,
//                 ease: "easeInOut"
//               }}
//             />
//           </Hero.Content>
//         </Hero>
//       </div>
//       <Divider />
//     </Container>
//   })
//   .add('DAOBackground', () => {
//     return <Container>
//       <Divider />
//       <Title><Code inline>Image</Code> component:  </Title>
//       <Paragraph secondary>Define and animate an image over <Code inline>Hero</Code> Component</Paragraph>
//       <Divider size="small" line />

//       <Code language="tsx">{`<DAOBackground />`}</Code>
//       <div style={{ height: '500px' }}>
//         <Hero>
//           <Hero.Content>
//             <DAOBackground />
//           </Hero.Content>
//         </Hero>
//       </div>
//       <Divider />
//     </Container>
//   })