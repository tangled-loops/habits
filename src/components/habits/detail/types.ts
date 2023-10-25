import { FrontendHabit } from "@/lib/models/habit";
import { TRPCClientErrorBase } from "@trpc/client";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";
import { DefaultErrorShape } from '@trpc/server';

export interface TRPCData {
  count: UseTRPCQueryResult<
    number | undefined,
    TRPCClientErrorBase<DefaultErrorShape>
  >;
}

export interface HasHabit {
  habit: FrontendHabit;
}

export type HasHabitAndTRPC = TRPCData & HasHabit;
