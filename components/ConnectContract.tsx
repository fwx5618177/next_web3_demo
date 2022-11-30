import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  VStack,
  StackDivider,
  Box,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ethers } from "ethers";
import { hooks } from "../connectors/metaMask";
import abi from "../abi/abi.json";
import { formatEther } from "ethers/lib/utils";

const { useAccount, useProvider } = hooks;

type ResultListProps = { name: string; value: string | number };

export default function ConnectContract() {
  const [alertShow, setAlertShow] = React.useState<boolean>(false);
  const [inputAddress, setInputAddress] = React.useState<string | null>(null);
  const [resultList, setResultList] = React.useState<ResultListProps[] | null>(
    null
  );

  const provider = useProvider();
  const account = useAccount();

  useEffect(() => {
    if (!account) return;
    // console.log(provider?.getBalance(account), provider?.getNetwork());

    const contract = new ethers.Contract(inputAddress as string, abi);
    const signContract = contract.connect(provider?.getSigner() as any);

    console.log(signContract, Object.keys(signContract));
    

    (async () => {
      const name = await signContract.name();
      const balance = await signContract.balanceOf(account);
      const baseURI = await signContract.baseURI();

      const reuslt = [
        {
          name: "name",
          value: name,
        },
        {
          name: "balance",
          value: formatEther(balance),
        },
        {
          name: "baseURI",
          value: baseURI,
        },
      ];

      setResultList(reuslt);
    })();
  }, [inputAddress]);

  return (
    <>
      <Heading fontSize={"xl"} my={4}>
        Contract (Now:
        <Badge variant="subtle" colorScheme="green">
          {account}
        </Badge>
        )
      </Heading>

      <FormControl>
        <FormLabel>Address</FormLabel>

        <Input
          size={"lg"}
          variant={"filled"}
          placeholder={"default"}
          type={"text"}
          onKeyUp={(e) => {
            const result = (e?.target as HTMLInputElement)?.value;

            if (!result) {
              setAlertShow(true);

              setTimeout(() => {
                setAlertShow(false);
              }, 3000);
              return;
            }

            setInputAddress(result);
          }}
        />
        <FormHelperText>Please input your contract address!</FormHelperText>
      </FormControl>

      <VStack
        divider={<StackDivider borderColor={"gray.200"} />}
        spacing={0}
        align="stretch"
      >
        {resultList?.map((ci, index) => (
          <Box key={index} h="30px">
            <Text fontSize={"20px"} color={"black"}>
              {ci?.name}
              {": "}
              {ci?.value}
            </Text>
          </Box>
        ))}
      </VStack>

      {alertShow && (
        <>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Connect Error!</AlertTitle>
            <AlertDescription>{"Can't Connect this address"}</AlertDescription>
          </Alert>
        </>
      )}
    </>
  );
}
