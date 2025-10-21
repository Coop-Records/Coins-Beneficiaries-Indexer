/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  LockableUniswapV3Initializer,
  LockableUniswapV3Initializer_Collect,
  LockableUniswapV3Initializer_Lock,
  BeneficiaryData,
} from "generated";
import { decodeAbiParameters } from "viem";

LockableUniswapV3Initializer.Collect.handler(async ({ event, context }) => {
  const entity: LockableUniswapV3Initializer_Collect = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pool: event.params.pool,
    beneficiary: event.params.beneficiary,
    fees0: event.params.fees0,
    fees1: event.params.fees1,
    transactionHash: event.transaction.hash,
    blockNumber: event.block.number,
  };
  context.LockableUniswapV3Initializer_Collect.set(entity);
});

LockableUniswapV3Initializer.Lock.handler(async ({ event, context }) => {
  console.log("Processing Lock event:", {
    transactionHash: event.transaction.hash,
    blockNumber: event.block.number,
    pool: event.params.pool,
    beneficiariesData: event.params.beneficiaries,
  });

  const lockId = `${event.chainId}_${event.block.number}_${event.logIndex}`;

  // Create the Lock entity
  const lockEntity: LockableUniswapV3Initializer_Lock = {
    id: lockId,
    pool: event.params.pool,
    transactionHash: event.transaction.hash,
    blockNumber: event.block.number,
  };
  context.LockableUniswapV3Initializer_Lock.set(lockEntity);

  // Process the beneficiaries tuple array
  event.params.beneficiaries.forEach((beneficiary: any, index: number) => {
    const beneficiaryEntity: BeneficiaryData = {
      id: `${lockId}_${index}`,
      lockId: lockId,
      pool: event.params.pool,
      beneficiary: beneficiary[0], // First element is beneficiary address
      shares: beneficiary[1], // Second element is shares
      transactionHash: event.transaction.hash,
      blockNumber: event.block.number,
    };
    context.BeneficiaryData.set(beneficiaryEntity);
  });

  console.log("Created Lock entity:", lockEntity);
  console.log(
    "Created",
    event.params.beneficiaries.length,
    "BeneficiaryData entities"
  );
});
