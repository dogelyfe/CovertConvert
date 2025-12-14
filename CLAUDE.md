# CLAUDE.md

> **For the Claude Agent:**
> 1. **READ project documentation in `/docs/` FIRST.** Check for PRD, architecture docs, and current sprint status.
> 2. This file contains Claude-specific rules, workflows, and the handoff system.

---

## Work for Hire Agreement

**CRITICAL**: All code, commits, and contributions produced by Claude agents for this project are **work for hire**.

**Requirements:**
- NEVER add AI-generated signatures, attributions, or credits to any code, commits, or documentation
- NEVER include "Generated with Claude Code", "Co-Authored-By: Claude", or similar AI attributions
- All work product belongs exclusively to the project owner
- Commits must appear as if written by a human developer
- This is a non-negotiable contractual requirement

---

## Context Management & Handoffs

**CRITICAL PROTOCOL: Proactive Handoff Documents**

### One Handoff Per Session Rule

**DEFAULT: Update, don't create.**

- **Start of session:** Create ONE handoff document
- **During session:** UPDATE that same document progressively
- **End of session:** Final update with comprehensive summary

**Exception:** Only create a NEW handoff if:
- Starting a completely different task (major pivot)
- Picking up work from a previous agent (fresh start)
- Session ends and new work begins (different day/agent)

### When to Create vs Update

**CREATE a new handoff when:**
- Starting fresh work (no existing handoff for this task)
- Major pivot (switching tasks completely)
- Fresh agent picking up prior work (continuation handoff)
- New session with different scope

**UPDATE existing handoff when:**
- Still working on the same task
- Same session, new discoveries (bugs found, tests completed)
- Context growing but scope unchanged
- End of session summary

**NEVER create multiple handoffs in a single session for the same task.**

### Handoff Lifecycle Example

```
09:00 - CREATE: 251211_0900-PST_HANDOFF_FEATURE_X.md
        Initial: Task overview, plan, setup steps

11:00 - UPDATE: Same file
        Progress: First component done, bug found, tests passing

13:00 - UPDATE: Same file (final)
        Complete: Full results, remaining work, handoff to next agent
```

### When to Update Your Handoff

Update your handoff document when:
- Context usage > 60% (update early, keep it current)
- Significant progress made (bug fixed, test passed, milestone reached)
- Major discovery (blocker found, architecture decision needed)
- End of work session (final comprehensive update)

### Filename Format

**Format:** `{YYMMDD}_{HHMM-TZ}_HANDOFF_{TOPIC}.md`

**Examples:**
- `251211_1430-PST_HANDOFF_MVP_CONVERTER.md`
- `251211_0900-PST_HANDOFF_BUG_FIX_UPLOAD.md`

**Location:** `/docs/handoffs/{YYYY-MM}/`

### Timezone and Timestamp Requirements

**CRITICAL:** Always verify current time before creating timestamps.

**Mandatory Steps:**

1. **Check Current Time:**
   ```bash
   date
   ```

2. **Use Local Timezone:**
   - Format: `YYMMDD_HHMM-TZ` (e.g., `251211_1728-PST`)
   - Match filename timestamp to header timestamp

3. **Common Mistakes to Avoid:**
   - Using UTC time and labeling it as local
   - Creating timestamps without verifying actual time
   - Mental timezone calculations (always use `date` command)

### Required Structure

Every handoff MUST follow the template at `/docs/handoffs/TEMPLATE_HANDOFF.md`.

**Critical Rule:** A fresh agent must be able to pick up work with ZERO additional questions.

### Handoff Chain Tracking

**Every handoff is part of a chain:**

```
SOURCE HANDOFF (Parent)  <-- The handoff you received
        |
        v (you work on it)
SOURCE HANDOFF (Updated) <-- Mark completion status
        |
        v (create successor)
YOUR HANDOFF (Child)     <-- References source + your new work
```

**When receiving a handoff:**
1. Note the source handoff path in your session context
2. Work through the action items
3. **Before creating your own handoff**, update the source handoff's completion record
4. In your new handoff, reference the source handoff you completed

### Receiving Agent Protocol

**When you receive a handoff with action items:**

**Step 1: Acknowledge Receipt**
- Read the entire handoff
- Identify the action items checklist
- Note any initial prompt/guidance

**Step 2: Execute Work**
- Work through action items in order
- Mark items complete as you go
- Document any deviations or skipped items

**Step 3: Update Source Handoff Completion Record**
Before creating your successor handoff:
1. Open the source handoff you worked from
2. Find or add the "## Completion Record" section
3. Fill in completion status

**Step 4: Create Successor Handoff**
- Reference the source handoff in your metadata
- Include any unfinished items from source
- Chain continues...

### Completion Status Definitions

| Status | Meaning |
|--------|---------|
| `COMPLETED` | All action items done as specified |
| `PARTIAL` | Some items done, some remain (document which) |
| `BLOCKED` | Could not proceed due to blocker (document it) |
| `SUPERSEDED` | Plan changed significantly, new handoff replaces this |

---

## Agent Coding Rules

### Core Principles

- **Do what was asked; nothing more, nothing less.**
- **NEVER create files unless absolutely necessary.** Always prefer editing existing files.
- **NEVER proactively create documentation** unless explicitly requested.
- **Read before you write.** Never propose changes to code you haven't read.
- **Verify before you claim.** If you say something exists, prove it.
- **Build on existing patterns.** Read templates, components, and related code before proposing new UI or architecture. Don't invent layouts or structures — discover what's already there and extend it.

### Pattern Discovery Protocol

**Before proposing any UI, layout, or architectural changes:**

1. **Read the actual source.** Templates, components, stylesheets — not memory or assumptions.
2. **Identify existing patterns.** How are similar features implemented? What's the established structure?
3. **Propose extensions, not inventions.** New features should feel native to the existing codebase.
4. **When uncertain, ask or read more.** Never guess at structure — verify it.

**Anti-pattern:** Describing or diagramming layouts without reading the actual template files first. This leads to proposals that conflict with established patterns and wastes time.

**Correct approach:** `Read templates/*.js` → understand actual structure → propose changes that fit.

### Code Quality Standards

**Avoid Over-Engineering:**
- Don't add features beyond what was asked
- Don't refactor surrounding code during a bug fix
- Don't add docstrings/comments to unchanged code
- Don't add error handling for scenarios that can't happen
- Don't create abstractions for one-time operations
- Don't design for hypothetical future requirements

**Avoid Backwards-Compatibility Hacks:**
- If something is unused, delete it completely
- No `_unused` variable renames
- No `// removed` comments for deleted code
- No re-exporting for compatibility

**Security First:**
- Never introduce command injection, XSS, SQL injection vulnerabilities
- Validate at system boundaries (user input, external APIs)
- If you notice insecure code you wrote, fix it immediately

### Testing Standards

**Before claiming tests pass:**
- Actually run the tests
- Provide the command used and output
- If tests fail, document why and fix or create a plan

**Test naming:**
- Describe what the test verifies, not how
- Use clear, specific test names

### Git & Commits

**Commit Messages:**
- Write clear, descriptive commit messages
- Focus on "why" not just "what"
- Never include AI attribution (work for hire)

**Before Committing:**
- Run tests
- Verify build succeeds
- Check for uncommitted debug code

### File Operations

**Creating Files:**
- Justify why a new file is needed
- Check if an existing file should be extended instead
- Use appropriate naming conventions for the project

**Modifying Files:**
- Read the file first (always)
- Understand context before making changes
- Preserve existing patterns and styles

### Error Handling Template

When errors occur, structure your response:

**What it means:** Plain-English error summary
**Why it happens:** Typical root causes
**Immediate fix:** Exact commands to resolve
**Verify:** Quick checks to confirm the fix worked
**Prevention:** How to avoid in the future

---

## Important Instruction Reminders

- Do what has been asked; nothing more, nothing less.
- NEVER create files unless they're absolutely necessary.
- ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files unless explicitly requested.
- Complete tasks fully - do not stop mid-task or claim context limits prevent completion.

---

*Last Updated: 2025-12-13*
