import { useEffect, useState } from 'react'
import { hooks, metaMask } from '../connectors/metaMask'
import { Card } from '../components/Card'
import { HStack, Box } from '@chakra-ui/react'
import ConnectContract from '../components/ConnectContract'

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

export default function MetaMaskCard() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  const [error, setError] = useState<((error: Error | undefined) => void) | undefined>(undefined)

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, [])

  return (
    <HStack spacing={8} direction='row'>
    <Box>
      <Card
        connector={metaMask}
        chainId={chainId}
        isActivating={isActivating}
        isActive={isActive}
        error={error as Error | undefined}
        setError={setError as (error: Error | undefined) => void}
        accounts={accounts}
        provider={provider}
        ENSNames={ENSNames}
      />
    </Box>

    <Box borderWidth='1px' borderRadius='lg' shadow={'lg'} w='800px' h='300' p={10}>
      <ConnectContract />
    </Box>
    </HStack>
  )
}