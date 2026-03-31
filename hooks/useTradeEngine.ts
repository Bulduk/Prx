import { useRef, useCallback } from 'react';

export type TradeSide = 'YES' | 'NO';

export interface TradeResult {
  success?: boolean;
  error?: string;
  marketId?: string;
  side?: TradeSide;
  amount?: number;
}

export function useTradeEngine() {
  // Use a ref to prevent double execution (lock) without triggering re-renders
  const isTrading = useRef(false);

  const placeTrade = useCallback(async (
    marketId: string, 
    side: TradeSide, 
    amount: number
  ): Promise<TradeResult> => {
    if (isTrading.current) {
      return { error: 'Trade already in progress' };
    }
    
    if (amount <= 0) {
      return { error: 'Amount must be greater than 0' };
    }

    isTrading.current = true;

    try {
      // Simulate network latency for Supabase RPC
      await new Promise(resolve => setTimeout(resolve, 250));
      
      // In a production app, this would be:
      // const { data, error } = await supabase.rpc('place_trade', { 
      //   p_market_id: marketId, 
      //   p_side: side, 
      //   p_amount: amount 
      // });
      // if (error) throw error;

      return { success: true, marketId, side, amount };
    } catch (err) {
      console.error('Trade failed:', err);
      return { error: 'Failed to execute trade. Please try again.' };
    } finally {
      // Release the lock
      isTrading.current = false;
    }
  }, []);

  return { placeTrade };
}
