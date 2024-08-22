use anchor_lang::prelude::*;

declare_id!("7DuJmQ3iuTUCuwUetssATWERo119z9dVp8sFQeVpeUuA");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize_count(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.user = ctx.accounts.user.key();
        counter.number = 0;
        Ok(())
    }

    pub fn increase(ctx: Context<Increase>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.number += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    user: Signer<'info>,

    #[account(
    init,
    seeds=[user.key().as_ref()],
    bump,
    payer=user,
    space=100
)]
    counter: Account<'info, Counter>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increase<'info> {

    user: Signer<'info>,

    #[account(mut, has_one = user)]
    counter: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    user: Pubkey,
    number: u64,
}
