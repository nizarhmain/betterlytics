/**
 * This script generates wrappers for app/actions/authenticated.
 * These routes require a `AuthContext` as their first argument.
 */

const OUTPUT_FILE = './src/app/actions/authenticated.ts';

/**
 * Implementation
 */
console.log("[+] Intitiating generation");
console.time("[+] Auto-generation of actions");

import { Project } from 'ts-morph';
import { writeFileSync } from 'fs';


// Get files to transform
console.log("[+] Reading files");
const project = new Project();
const files = project.addSourceFilesAtPaths('./src/app/actions/with-auth/*.ts');
const functions = files
  .flatMap((file) => file.getFunctions())
  .filter((func) => func.isExported());

// Validate functions
console.log("[+] Validating");
try {
  files.forEach((file) => {
    const statements = file.getStatements();
    if (statements.length < 1 || !statements[0].getText().includes("server only")) {
      throw `File "${file.getBaseName()}" must start with "use server";`;
    }
  })

  functions.forEach((func) => {
    const fileName = func.getSourceFile().getBaseName();
    const functionName = func.getName();
    const functionParams = func.getParameters();

    if (functionName === undefined) {
      throw `Anonymous functions are not allow - found on in "${fileName}"`;
    }

    if (functionParams.length < 1 || functionParams[0].getType().getText() !== 'AuthContext') {
      throw `The first parameter of "${functionName}" must be of type "AuthContext"`;
    }
  });
} catch(e) {
  console.error("[-] Error:", e);
  process.exit();
}

// Code-gen
console.log("[+] Generating");
const BASE = `
"use server";

/**
 * THIS FILE IS AUTO-GENERATED - DO NOT EDIT DIRECTLY
 */

// Import actions requiring auth wrapping
import * as authenticated from './with-auth'

// Imports
import { AuthContext } from "@/entities/authContext";
import { requireDashboardAuth } from "@/lib/auth-actions";
import { authorizeUserDashboard } from "@/services/auth.service";

// Type definitions
type GetAuthRestProps<T> = T extends (context: AuthContext, ...args: infer Args) => unknown ? Args : never;

// Auth context
async function usingAuthContext(dashboardId: string): Promise<AuthContext> {
  const session = await requireDashboardAuth();
  const context = await authorizeUserDashboard(session.user.id, dashboardId);
  return context;
}
`;

function wrapFunctionFromName(functionName: string) {
  return`
export async function ${functionName}(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.${functionName}>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.${functionName}(context, ...args);
  } catch (e) {
    console.error('An error occured in "${functionName}:"', e);
    throw new Error('An error occurred');
  }
}`;
}

const wrappedFunctions = files
  .flatMap((file) => file.getFunctions())
  .map((func) => wrapFunctionFromName(func.getName()!));

const generated = `
${BASE}

// Functions
${wrappedFunctions.join('\n')}
`;

console.log("[+] Writing to file");
writeFileSync(OUTPUT_FILE, generated);

console.timeEnd("[+] Auto-generation of actions");
console.log("[+] Completed successfully");
