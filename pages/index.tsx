import { ChakraProvider } from '@chakra-ui/react'
import MetaMaskCard from '../connectorCards/MetaMaskCard'


export default function Home() {
  return (
    <ChakraProvider>
    <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
      <MetaMaskCard />
    </div>
    </ChakraProvider>
  )
}
