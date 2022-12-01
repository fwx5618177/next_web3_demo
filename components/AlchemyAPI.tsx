import {
  Badge,
  Heading,
  Textarea,
  Text,
} from "@chakra-ui/react";
import React from "react";
import axios from 'axios'
import conf from '../conf/alchemy.sdk.json'
import { hooks } from "../connectors/metaMask";

export default function AlchemyAPI() {
  const [addresses, setAddresses] = React.useState<string[]>([]);
  const [balances, setBalances] = React.useState<string>('')
  const { useAccount } = hooks;
  const account = useAccount()

  const handleRequest = async (e: any) => {
    const data: string = (e?.target as HTMLInputElement)?.value;
    const result: string[] = data?.split(",")?.map((ci) => ci?.trim())
    const apiKey = conf.apiKey
    const baseURL = `${conf.baseURL}${apiKey}`

    console.log(result);
    
    
    const reqData = JSON.stringify({
      "jsonrpc": "2.0",
      "method": "alchemy_getTokenBalances",
      "params": [
        `${account}`,
        result,
      ],
      "id": 42
    })

    const reqConfig = {
      method: 'post',
      url: baseURL,
      headers: {
        'Content-Type': 'application/json'
      },
      data : reqData
    }

    const balances = await axios(reqConfig)
    
    const resultBalances = balances?.data?.result?.tokenBalances?.map((ci: { tokenBalance: any; }) => ci?.tokenBalance)

    console.log( balances?.data?.result?.tokenBalances?.map((ci: { tokenBalance: any; }) => ci?.tokenBalance), resultBalances);
    
    // const balances = await web3.alchemy.getTokenBalances(account as string, result)

    // setBalances(balances?.tokenBalances?.map(ci => ci?.tokenBalance).join(', '))
    setBalances(resultBalances?.join(', '))
    setAddresses(result);
  }

  return (
    <>
      <Heading fontSize={"xl"} my={4}>
        Batch API
        <Badge variant="subtle" colorScheme="green"></Badge>
      </Heading>

      <Text mb={"8px"}>Address: {addresses.join(", ")}</Text>
      <Textarea
        placeholder="Here is a sample placeholder"
        onKeyUp={handleRequest}
      />
      <Text mb={"8px"}>Balances: {balances}</Text>
    </>
  );
}
