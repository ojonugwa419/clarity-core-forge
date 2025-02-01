import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure can create new app",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "core-forge",
        "create-app",
        [
          types.ascii("Test App"),
          types.ascii("A test application")
        ],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: "Ensure only owner can update app status",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;
    
    // First create an app
    let block = chain.mineBlock([
      Tx.contractCall(
        "core-forge",
        "create-app",
        [
          types.ascii("Test App"),
          types.ascii("A test application")
        ],
        wallet_1.address
      )
    ]);
    
    // Try to update status with non-owner
    block = chain.mineBlock([
      Tx.contractCall(
        "core-forge",
        "update-app-status",
        [
          types.uint(1),
          types.ascii("inactive")
        ],
        wallet_2.address
      )
    ]);
    
    block.receipts[0].result.expectErr().expectUint(100);
  },
});
