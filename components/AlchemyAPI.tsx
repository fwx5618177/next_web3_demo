import { Badge, Heading, Textarea, Text } from "@chakra-ui/react";
import React from "react";
import axios from "axios";
import { Network, Alchemy, AlchemySubscription } from "alchemy-sdk";
import conf from "../conf/alchemy.sdk.json";
import { hooks } from "../connectors/metaMask";

export default function AlchemyAPI() {
  const [addresses, setAddresses] = React.useState<string[]>([]);
  const [balances, setBalances] = React.useState<string>("");
  const { useAccount } = hooks;
  const account = useAccount();

  const handleRequest = async (e: any) => {
    const data: string = (e?.target as HTMLInputElement)?.value;
    const result: string[] = data?.split(",")?.map((ci) => ci?.trim());
    const apiKey = conf.apiKey;
    const baseURL = `${conf.baseURL}${apiKey}`;

    if(!data) return 

    console.log(result);

    const reqData = JSON.stringify({
      jsonrpc: "2.0",
      method: "alchemy_getTokenBalances",
      params: [`${account}`, result],
      id: 42,
    });

    const reqConfig = {
      method: "post",
      url: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      data: reqData,
    };

    const balances = await axios(reqConfig);

    const resultBalances = balances?.data?.result?.tokenBalances?.map(
      (ci: { tokenBalance: any }) => ci?.tokenBalance
    );

    console.log(
      balances?.data?.result?.tokenBalances?.map(
        (ci: { tokenBalance: any }) => ci?.tokenBalance
      ),
      resultBalances
    );

    setBalances(resultBalances?.join(", "));
    setAddresses(result);
  };

  const handleRequestSDK = async (e: any) => {
    const settings = {
      apiKey: conf.apiKey,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(settings);

    // Get the latest block
    const latestBlock = alchemy.core.getBlockNumber();

    // Get all outbound transfers for a provided address
    alchemy.core
      .getTokenBalances("0x994b342dd87fc825f66e51ffa3ef71ad818b6893")
      .then(console.log);

    // Get all the NFTs owned by an address
    const nfts = alchemy.nft.getNftsForOwner("0xshah.eth");

    // Listen to all new pending transactions
    alchemy.ws.on(
      { method: "alchemy_pendingTransactions" as AlchemySubscription, fromAddress: "0xshah.eth" },
      (res) => console.log(res)
    );

    
  };

  return (
    <>
      <Heading fontSize={"xl"} my={4}>
        Batch API
        <Badge variant="subtle" colorScheme="green"></Badge>
      </Heading>

      <Text mb={"8px"}>Address: {addresses.join(", ")}</Text>
      <Textarea
        placeholder="Here is a sample placeholder"
        onKeyUp={
          // handleRequest
          handleRequestSDK
        }
      />
      <Text mb={"8px"}>Balances: {balances}</Text>
    </>
  );
}
