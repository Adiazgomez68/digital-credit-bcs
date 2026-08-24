import { advisorAuthHandlers } from "./advisor-auth";
import { applicationsHandlers } from "./applications";

export const handlers = [...applicationsHandlers, ...advisorAuthHandlers];
