import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { web3 } from "@coral-xyz/anchor";
import { expect } from "chai";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
const assert = require("assert");

const { SystemProgram } = web3;

describe("Counter Program", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter;

  it("Initialize counter", async () => {
    const user = anchor.web3.Keypair.generate();

    // Airdrop some SOL for testing
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 1000000000)
    );

    // Generate PDA (Program Derived Address)
    const [counterPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [user.publicKey.toBuffer()],
      program.programId
    );

    // Execute initialize transaction
    await program.methods
      .initializeCount()
      .accounts({
        user: user.publicKey,
        counter: counterPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Fetch the counter account and assert
    const counterAccount = await program.account.counter.fetch(counterPda);
    assert.equal(counterAccount.number.toString(), "0");
  });

  // Testing increase instruction

  it("Increase counter", async () => {
    const user = anchor.web3.Keypair.generate();

    // Airdrop some SOL for testing
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 1000000000)
    );

    // Generate PDA (Program Derived Address)
    const [counterPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [user.publicKey.toBuffer()],
      program.programId
    );

    // First Initialize it
    await program.methods
      .initializeCount()
      .accounts({
        user: user.publicKey,
        counter: counterPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Execute increase transaction
    await program.methods
      .increase()
      .accounts({
        user: user.publicKey,
        counter: counterPda,
      })
      .signers([user])
      .rpc();

    // Fetch the counter account and assert
    const counterAccount = await program.account.counter.fetch(counterPda);
    assert.equal(counterAccount.number.toString(), "1");
  });
});
