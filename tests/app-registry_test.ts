import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure can register app details",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    // First create app in core contract
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
    
    // Now register app details
    block = chain.mineBlock([
      Tx.contractCall(
        "app-registry",
        "register-app",
        [
          types.uint(1),
          types.none(),
          types.ascii("1.0.0"),
          types.ascii("{\"key\":\"value\"}")
        ],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});
