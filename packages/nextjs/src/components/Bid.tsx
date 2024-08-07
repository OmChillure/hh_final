"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import CodeSnippet from "@/components/nillion/CodeSnippet";
import { CopyString } from "@/components/nillion/CopyString";
import { NillionOnboarding } from "@/components/nillion/NillionOnboarding";
import RetrieveSecretCommand from "@/components/nillion/RetrieveSecretCommand";
import SecretForm from "@/components/nillion/SecretForm";
import { Address } from "@/components/scaffold-eth";
import { compute } from "@/utils/nillion/compute";
import { getUserKeyFromSnap } from "@/utils/nillion/getUserKeyFromSnap";
import { retrieveSecretCommand } from "@/utils/nillion/retrieveSecretCommand";
import { retrieveSecretInteger } from "@/utils/nillion/retrieveSecretInteger";
import { storeProgram } from "@/utils/nillion/storeProgram";
import { storeSecretsInteger } from "@/utils/nillion/storeSecretsInteger";
import { Slider } from "@nextui-org/slider";
import { set } from "nprogress";

interface StringObject {
  [key: string]: string | null;
}

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [connectedToSnap, setConnectedToSnap] = useState<boolean>(false);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userIdAdmin, setUserIdAdmin] = useState<string | null>(null);
  const [nillion, setNillion] = useState<any>(null);
  const [nillionClient, setNillionClient] = useState<any>(null);

  const [programName] = useState<string>("nft_bid");
  const [programId, setProgramId] = useState<string | null>(null);
  const [programIdInput, setProgramIdInput] = useState<string>("");
  const [computeResult, setComputeResult] = useState<string | null>(null);
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false);
  const [bidderIndex, setBidderIndex] = useState<string>("");
  const [partyName, setPatyName] = useState<string>("");
  const [secretName, setSecretName] = useState<string>("");
  const [secretValue, setSecretValue] = useState<string>("0");
  const [valueBidder, setValueBidder] = useState<string>("0");
  const [storeId1, setStoreId1] = useState<string>("");
  const [storeId2, setStoreId2] = useState<string>("");
  const [storeId3, setStoreId3] = useState<string>("");
  const [partyIdsStoreIds, setPartyIdsStoreIds] = useState<string>("");
  const [winner, setWinner] = useState<string | null>(null);

  const [storedSecretsNameToStoreId, setStoredSecretsNameToStoreId] = useState<StringObject>({
    my_int1: null,
    my_int2: null,
  });
  const [parties] = useState<string[]>(["Bidder0"]);
  const [outputs] = useState<string[]>(["isWin"]);

  // connect to snap
  async function handleConnectToSnap() {
    const snapResponse = await getUserKeyFromSnap();
    setUserKey(snapResponse?.user_key || null);
    setConnectedToSnap(snapResponse?.connectedToSnap || false);
  }

  // store program in the Nillion network and set the resulting program id
  async function handleStoreProgram() {
    console.log("programName", programName);
    await storeProgram(nillionClient, programName).then(setProgramId);
    setIsDisabledButton(true);
  }

  async function handleRetrieveInt(secret_name: string, store_id: string | null) {
    if (store_id) {
      const value = await retrieveSecretInteger(nillionClient, store_id, secret_name);
      alert(`${secret_name} is ${value}`);
    }
  }

  // reset nillion values
  const resetNillion = () => {
    setConnectedToSnap(false);
    setUserKey(null);
    setUserId(null);
    setNillion(null);
    setNillionClient(null);
  };

  useEffect(() => {
    // when wallet is disconnected, reset nillion
    if (!connectedAddress) {
      resetNillion();
    }
  }, [connectedAddress]);

  // Initialize nillionClient for use on page
  useEffect(() => {
    if (userKey) {
      const getNillionClientLibrary = async () => {
        const nillionClientUtil = await import("@/utils/nillion/nillionClient");
        const libraries = await nillionClientUtil.getNillionClient(userKey);
        setNillion(libraries.nillion);
        setNillionClient(libraries.nillionClient);
        return libraries.nillionClient;
      };
      getNillionClientLibrary().then(nillionClient => {
        const user_id = nillionClient.user_id;
        setUserId(user_id);
      });
    }
  }, [userKey]);

  // handle bidder index
  function handleBidderIndex(value: string) {
    setBidderIndex(value);
    setPatyName("Bidder" + value);
    setSecretName("bid_input" + value);
  }

  function handleSliderChange(value: number) {
    console.log("Slider value: ", value);
    setValueBidder(value.toString());
    setSecretValue(value.toString());
  }

  async function handleBidder() {
    if (programId) {
      console.log("programId", programId);
      console.log("secretName", secretName);
      console.log("partyName", partyName);
      console.log("secretValue", secretValue);

      const secrets = new nillion.Secrets();

      // create new SecretInteger with value cast to string
      const newSecret = nillion.Secret.new_integer(secretValue);
      // insert the SecretInteger into secrets object
      secrets.insert(secretName, newSecret);

      // create program bindings for secret so it can be used in a specific program
      const secret_program_bindings = new nillion.ProgramBindings(programId);

      // set the input party to the bindings to specify which party will provide the secret
      const party_id = nillionClient.party_id;
      secret_program_bindings.add_input_party(partyName, party_id);

      // get user id for user storing the secret
      const user_id = nillionClient.user_id;
      console.log("user_id", user_id);

      // create a permissions object, give the storer default permissions, including compute permissions with the program id
      const permissions = nillion.Permissions.default_for_user(user_id, programId);

      if (userIdAdmin) {
        console.log("userIdAdmin", userIdAdmin);
        const computePermissions: { [key: string]: string[] } = {};
        computePermissions[userIdAdmin] = [programId];
        console.log("computePermissions", computePermissions);
        permissions.add_compute_permissions(computePermissions);
      }

      // store secret(s) with bindings and permissions
      const store_id = await nillionClient.store_secrets(
        process.env.NEXT_PUBLIC_NILLION_CLUSTER_ID,
        secrets,
        secret_program_bindings,
        permissions,
      );
      console.log("party_id", party_id);
      console.log("store_id", store_id);
      console.log("party_ids_to_store_ids", party_id + ':' + store_id);
      setPartyIdsStoreIds(party_id + ':' + store_id);

      if (partyName == 'Bidder0') {
        const storeIds = [store_id, storeId1, storeId2, storeId3];
        const result = await compute(nillion, nillionClient, storeIds, programId, outputs);
        setComputeResult(result);
        setWinner(result);
      }

      const updatedStoredSecrets = { ...storedSecretsNameToStoreId };
      updatedStoredSecrets[secretName] = store_id;
      setStoredSecretsNameToStoreId(updatedStoredSecrets);
    }
  }

  return (
    <div>
      <NillionOnboarding
        connectedToSnap={connectedToSnap}
        handleConnectToSnap={handleConnectToSnap}
      />

      {connectedAddress && connectedToSnap && (
        <div>
          <p className="my-2 text-center">
            Welcome, <Address address={connectedAddress} />! You are connected to Snap.
          </p>
          <p className="my-2 text-center">User ID: {userId}</p>
          <SecretForm
            storeSecretInteger={storeSecretsInteger}
            retrieveSecretInteger={handleRetrieveInt}
            nillionClient={nillionClient}
          />
          <button onClick={handleStoreProgram} disabled={isDisabledButton}>
            Store Program
          </button>
          {programId && (
            <div>
              <p className="my-2 text-center">Program ID: {programId}</p>
              <RetrieveSecretCommand
                retrieveSecretCommand={retrieveSecretCommand}
                nillionClient={nillionClient}
              />
              <CodeSnippet>{programId}</CodeSnippet>
              <CopyString copyString={programIdInput} setCopyString={setProgramIdInput} />
            </div>
          )}
          <div>
            <label>
              Bidder Index:
              <input
                type="text"
                value={bidderIndex}
                onChange={(e) => handleBidderIndex(e.target.value)}
              />
            </label>
            <Slider onValueChange={handleSliderChange} value={Number(valueBidder)} />
            <button onClick={handleBidder}>Submit Bid</button>
          </div>
          {winner && (
            <div>
              <p>Winner: {winner}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
