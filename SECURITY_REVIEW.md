# Security Review: SimpleToken.sol

**Reviewer:** Mark Evans aka Interchained dev@interchained.org
**Date:** February 11, 2026
**Contract:** `contracts/SimpleToken.sol`
**Solidity Version:** ^0.8.0

---

## Finding 1: ERC-20 Approval Race Condition

**Severity:** High

**Description:** The `approve()` function directly sets the allowance to a new value without checking the current allowance. This creates a well-known race condition: if a spender sees an `approve` transaction in the mempool that changes their allowance from N to M, they can front-run by spending the original N tokens first, then spend the new M tokens after the approval goes through, effectively spending N + M instead of the intended M.

**Recommended Fix:** Implement `increaseAllowance()` and `decreaseAllowance()` functions (as in OpenZeppelin's ERC-20) so users can adjust allowances atomically without the double-spend window. Alternatively, require setting allowance to 0 before changing to a new non-zero value.

---

## Finding 2: Missing Zero-Address Checks

**Severity:** Medium

**Description:** The `transfer()` and `transferFrom()` functions do not validate that the `to` address is not `address(0)`. Tokens sent to the zero address are permanently burned and unrecoverable. Similarly, `approve()` does not check whether the `spender` is `address(0)`, which would create a useless and potentially misleading approval. The constructor also does not validate `msg.sender` against zero address, though in practice this is less exploitable.

**Recommended Fix:** Add `require(to != address(0), "Transfer to zero address")` at the start of `transfer()` and `transferFrom()`. Add `require(spender != address(0), "Approve to zero address")` in `approve()`.

---

## Finding 3: No Access Control or Minting Restrictions

**Severity:** Medium

**Description:** The contract has no owner, admin, or role-based access control. The entire token supply is minted to `msg.sender` in the constructor with no cap enforcement or minting governance. While simple, this means there is no way to pause the contract in an emergency, no ability to blacklist compromised addresses, and no upgradeability path. For a production token, this represents a significant operational risk.

**Recommended Fix:** Implement OpenZeppelin's `Ownable` or `AccessControl` pattern. Consider adding a `pause()` mechanism (using `Pausable`) for emergency response. If minting should be possible post-deployment, add a guarded `mint()` function with appropriate role checks and supply caps.

---

## Additional Observation: No Event Indexed Parameters Best Practice

**Severity:** Low

**Description:** While events are emitted correctly for `Transfer` and `Approval`, the contract does not implement the full ERC-20 interface (missing `IERC20` import and explicit interface declaration). This could cause compatibility issues with tools and indexers that expect strict ERC-20 compliance, including `totalSupply()`, `balanceOf()`, and other view functions to be declared through the interface.

**Recommended Fix:** Import and explicitly implement the IERC20 interface from OpenZeppelin to ensure full standard compliance and tooling compatibility.

---

## Bonus Finding: Supply Chain Attack in Assessment Repository

**Severity:** Critical

**Description:** During pre-installation code review, a Remote Code Execution (RCE) backdoor was discovered in `backend/config/store.js`, embedded inside the mock data for project ID 9 ("Token Vesting Platform"). The malicious payload was disguised as a `notes` field and executed an immediately-invoked async function that:

1. Made a POST request to an external server (`https://blog-post01234-beta.vercel.app/api/blogs/getOrder`)
2. Fetched arbitrary JavaScript code from the response body
3. Executed that code using `new Function('require', ...)(require)`, giving it full access to Node.js built-ins
4. Set a `setTimeout` to repeat this every 5 minutes (300,000 ms)

This is a classic supply chain attack targeting developers who run `npm start` without reviewing the codebase first. The attacker gains persistent remote code execution on the victim's machine with full filesystem and network access.

**Action Taken:** The malicious payload was removed and replaced with legitimate mock description text before any dependencies were installed or code was executed.

**Recommendation:** The repository maintainers were notified immediately. All candidates who previously ran this assessment should be warned that their machines may have been compromised. The repository should be audited for any other embedded payloads, and commit history should be reviewed to identify when and by whom the payload was introduced.
