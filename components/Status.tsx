import type { Web3ReactHooks } from '@web3-react/core'
import { Badge } from '@chakra-ui/react'

export function Status({
  isActivating,
  isActive,
  error,
}: {
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error?: Error
}) {
  return (
    <div>
      {error ? (
        <>
          🔴 <Badge variant='subtle' colorScheme='red'>{error.name ?? 'Error'}</Badge>
          {error.message ? `: ${error.message}` : null}
        </>
      ) : isActivating ? (
        <>🟡 <Badge variant='subtle' colorScheme='yellow'>Connecting</Badge></>
      ) : isActive ? (
        <>🟢 <Badge variant='subtle' colorScheme='green'>Connected</Badge></>
      ) : (
        <>⚪️ <Badge variant='subtle' colorScheme='purple'>Disconnected</Badge></>
      )}
    </div>
  )
}
