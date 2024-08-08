"use client"
import React, { useEffect, useState } from 'react';
import GenerateUserKey from '../../../../nillion/components/GenerateUserKey';
import CreateClient from '../../../..//nillion/components/CreateClient';
import * as nillion from '@nillion/client-web';

import { NillionClient, NadaValues } from '@nillion/client-web';
import StoreSecretForm from '../../../../nillion/components/StoreSecretForm';
import StoreProgram from '../../../../nillion/components/StoreProgramForm';
import ComputeForm from '../../../../nillion/components/ComputeForm';
import ConnectionInfo from '../../../../nillion/components/ConnectionInfo';
import Header from '@/components/Apiheader';

export default function Compute() {
  const programName = 'prediction_analysis';
  const outputNameTotal = 'totalPrediction';
  const outputNamesMax = ['isMax0', 'isMax1', 'isMax2', 'isMax3'];
  const partyNames = ['Analyst0', 'Analyst1', 'Analyst2', 'Analyst3'];
  
  const [userkey, setUserKey] = useState<string | null>(null);
  const [client, setClient] = useState<NillionClient | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [partyIds, setPartyIds] = useState<(string | null)[]>([null, null, null, null]);
  const [storeIds, setStoreIds] = useState<(string | null)[]>([null, null, null, null]);
  const [programId, setProgramId] = useState<string | null>(null);
  const [additionalComputeValues, setAdditionalComputeValues] = useState<NadaValues | null>(null);
  const [computeResultTotal, setComputeResultTotal] = useState<string | null>(null);
  const [computeResultsMax, setComputeResultsMax] = useState<(string | null)[]>([null, null, null, null]);

  useEffect(() => {
    if (userkey && client) {
      setUserId(client.user_id);
      const partyIds = partyNames.map(() => client.party_id);
      setPartyIds(partyIds);
      const additionalComputeValues = new nillion.NadaValues();
      setAdditionalComputeValues(additionalComputeValues);
    }
  }, [userkey, client]);

  return (
    <div>
      <Header/>
      <h1>Prediction Analysis Demo</h1>
      <p>
        Connect to Nillion with a user key, then follow the steps to store a
        program, store predictions from analysts, and compute the total and max predictions.
      </p>
      <ConnectionInfo client={client} userkey={userkey} />

      <h1>1. Connect to Nillion Client {client && ' ✅'}</h1>
      <GenerateUserKey setUserKey={setUserKey} />

      {userkey && <CreateClient userKey={userkey} setClient={setClient} />}
      <br />
      <h1>2. Store Program {programId && ' ✅'}</h1>
      {client && (
        <>
          <StoreProgram
            nillionClient={client}
            defaultProgram={programName}
            onNewStoredProgram={(program) => setProgramId(program.program_id)}
          />
        </>
      )}
      <br />
      <h1>3. Store Predictions {storeIds.every(id => id) && ' ✅'}</h1>
      {userId && programId && (
        <>
          {partyNames.map((partyName, index) => (
            <div key={index}>
              <h2>Store prediction for {partyName} {storeIds[index] && ' ✅'}</h2>
              <StoreSecretForm
                secretName={`prediction_input${index}`}
                onNewStoredSecret={(secret) => {
                  const newStoreIds = [...storeIds];
                  newStoreIds[index] = secret.storeId;
                  setStoreIds(newStoreIds);
                }}
                nillionClient={client}
                secretType="SecretInteger"
                isLoading={false}
                itemName=""
                hidePermissions
                defaultUserWithComputePermissions={userId}
                defaultProgramIdForComputePermissions={programId}
              />
            </div>
          ))}
        </>
      )}
      <br />
      <h1>4. Compute Total and Max Predictions {computeResultTotal && computeResultsMax.every(result => result) && ' ✅'}</h1>
      {client &&
        programId &&
        storeIds.every(id => id) &&
        partyIds.every(id => id) &&
        additionalComputeValues && (
          <>
            <ComputeForm
              nillionClient={client}
              programId={programId}
              additionalComputeValues={additionalComputeValues}
              storeIds={storeIds.filter((id) => id !== null)}
              inputParties={partyIds.filter((partyId) => partyId !== null).map((partyId, index) => ({ partyName: partyNames[index], partyId: partyId as string }))}
              outputParties={[{ partyName: partyNames[0], partyId: partyIds[0]! }]}
              outputName={outputNameTotal}
              onComputeProgram={(result) => setComputeResultTotal(result.value)}
            />
            {outputNamesMax.map((outputName, index) => (
              <ComputeForm
                key={index}
                nillionClient={client}
                programId={programId}
                additionalComputeValues={additionalComputeValues}
                storeIds={storeIds.filter((id) => id !== null)}
                inputParties={partyIds.filter((partyId) => partyId !== null).map((partyId, index) => ({ partyName: partyNames[index], partyId: partyId as string }))}
                outputParties={[{ partyName: partyNames[0], partyId: partyIds[0]! }]}
                outputName={outputName}
                onComputeProgram={(result) => {
                  const newComputeResultsMax = [...computeResultsMax];
                  newComputeResultsMax[index] = result.value;
                  setComputeResultsMax(newComputeResultsMax);
                }}
              />
            ))}
          </>
        )}
      <br />
      {computeResultTotal && (
        <div>
          <h2>Total Prediction: {computeResultTotal}</h2>
          <h2>Max Prediction Results:</h2>
          <ul>
            {computeResultsMax.map((result, index) => (
              <li key={index}>
                {partyNames[index]}: {result === '1' ? 'Max Prediction' : 'Not Max'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

