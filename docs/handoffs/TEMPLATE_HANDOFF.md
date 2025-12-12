---
# HANDOFF METADATA - Required fields for chain tracking
handoff_version: "2.0"
created: "YYYY-MM-DD HH:MM PST"
updated: "YYYY-MM-DD HH:MM PST"
status: "IN-PROGRESS"  # IN-PROGRESS | BLOCKED | COMPLETE | SUPERSEDED
priority: "P2"         # P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)

# Chain tracking - enables work history tracing
source_handoff: null   # Path to handoff this continues from, or null if fresh start
chain_position: 1      # 1 = fresh start, 2+ = continuation

# Classification
topic: "[TOPIC]"
type: "implementation" # implementation | investigation | bugfix | planning | documentation

# Work tracking
estimated_hours: null  # Estimated time to complete action items
actual_hours: null     # Filled in by completing agent
completion_status: null  # COMPLETED | PARTIAL | BLOCKED | SUPERSEDED (filled by receiver)
---

<!--
HANDOFF TEMPLATE v2.0 - Chain-Tracked Handoffs
Copy this template when creating a handoff document.
Delete all guidance comments (like this one) before saving.
Filename format: {YYMMDD}_{HHMM-TZ}_HANDOFF_{TOPIC}.md
Location: /docs/handoffs/{YYYY-MM}/
-->

# [TOPIC] - [One-line summary of status]

**Date:** YYYY-MM-DD HH:MM TZ
**Status:** [IN-PROGRESS / BLOCKED / COMPLETE]
**Priority:** [P0 (Critical) / P1 (High) / P2 (Medium) / P3 (Low)]

---

## Receiving Agent Prompt

<!--
This section guides the receiving agent. Write as if speaking directly to them.
-->

**Your mission:** [One sentence describing what the receiving agent should accomplish]

**Start here:**
1. [First action - be specific, include file paths or commands]
2. [Second action - continue the sequence]
3. [Expected outcome after these initial steps]

**Success looks like:** [Describe what "done" looks like]

**If blocked:** [Escalation path or alternative action]

---

## Source Handoff Chain

<!--
If this continues work from a previous handoff, document the chain.
-->

**Source:** `[path/to/source/handoff.md]` or "Fresh start - no prior handoff"
**Relationship:** [Continuation | Pivot | Escalation | Fresh Start]
**What was completed from source:** [Brief summary]
**What carries forward:** [Incomplete items from source]

---

## Executive Summary

<!--
2-3 sentences maximum:
- What was accomplished or current state?
- Critical blockers or dependencies?
- Immediate next action?
-->

[Brief summary of what was done, current state, and what's next]

---

## Current State

### What's Working

- [Feature/component] - fully implemented and tested
- [Bug fix] - resolved and verified

### What's Broken or Incomplete

- [Feature/component] - not implemented yet
- [Bug] - known issue, not fixed

### What's In-Progress

- [Component name] - X% complete
  - Done: [specific parts]
  - Remaining: [specific parts]

### Key Decisions Made

- **Decision:** [What was decided]
  - **Rationale:** [Why this approach]
  - **Alternatives rejected:** [Other options considered]

---

## Context for Fresh Agent

### Why This Work Matters

[Business value or user impact]

### Key Files Modified

- `path/to/file.ts` - [What changed and why]
- `path/to/another-file.tsx` - [What changed and why]

### Related Work

- Related issue/PR: [Reference]
- Related handoff: [`docs/handoffs/.../HANDOFF_...md`]

---

## Next Steps

### Immediate Task (< 30 minutes)

**Task:** [Clear, actionable description]

**Steps:**
1. [Specific step with command if applicable]
2. [Next step]

**Success criteria:**
- [ ] [Measurable outcome]
- [ ] [Measurable outcome]

### Short-term Tasks (< 4 hours)

**Task 1:** [Task name]
- **Files to modify:** [List]
- **Success criteria:** [How to verify]

**Task 2:** [Task name]
- **Files to create:** [List]
- **Success criteria:** [How to verify]

### Definition of Done

- [ ] All code committed and pushed
- [ ] Tests passing (or documented why not)
- [ ] Manual verification complete

---

## Blockers & Dependencies

### Active Blockers

**Blocker:** [Description]
- **Impact:** [What can't proceed]
- **Attempted solutions:** [What's been tried]
- **Escalation:** [Who/what needs to happen]

### What This Work Blocks

- [Work item] - waiting on [specific deliverable]

---

## Code Changes

### Files Created

**File:** `path/to/new-file.ts`
- **Purpose:** [What this file does]
- **Key exports:** [Main functions/components]

### Files Modified

**File:** `path/to/modified-file.ts`
- **Changes:** [High-level description]
- **Reason:** [Why changes were needed]

---

## Handoff Checklist

### Before Saving

- [ ] All code committed and pushed
- [ ] Next steps clearly defined with file paths
- [ ] All commands are copy-pasteable
- [ ] No "as discussed" references - all context explicit
- [ ] A fresh agent could pick this up with ZERO questions

---

## Completion Record

<!--
THIS SECTION IS FILLED BY THE RECEIVING AGENT when they complete work from this handoff.
Do NOT fill when creating - leave for the agent who works on it.
-->

**Completed By:** [Agent/session identifier - FILLED BY RECEIVER]
**Completion Date:** [YYYY-MM-DD HH:MM TZ - FILLED BY RECEIVER]
**Completion Status:** [COMPLETED | PARTIAL | BLOCKED | SUPERSEDED]
**Actual Hours:** [Time spent]

### Action Items Checklist

<!--
Receiving agent copies items from "Next Steps" and marks completion:
- [x] Completed as specified
- [~] Completed with modification (explain below)
- [ ] SKIPPED (explain below)
- [!] BLOCKED (explain below)
-->

- [ ] [Action item 1]
- [ ] [Action item 2]

### Deviations from Plan

- **Modifications:** [What changed and why]
- **Skipped items:** [What was skipped and why]
- **Additional work:** [Unplanned work done]

### Successor Handoff

**Path:** `[docs/handoffs/YYYY-MM/YYMMDD_HHMM-TZ_HANDOFF_TOPIC.md]`
**Relationship:** [Continuation | Pivot | Complete (no successor needed)]

---

**END OF HANDOFF**
