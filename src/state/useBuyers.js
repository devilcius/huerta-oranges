import { useEffect, useMemo, useRef, useState } from "react";
import { createBuyer, deleteAllBuyers, deleteBuyer, fetchBuyers, patchBuyer } from "../api/buyersApi";

export function useBuyers({ nameFilter } = {}) {
  const [buyers, setBuyers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const lastRequestIdRef = useRef(0);

  async function refresh() {
    const requestId = ++lastRequestIdRef.current;

    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await fetchBuyers({ nameFilter });

      // Ignore out-of-order responses (typing filter quickly)
      if (requestId !== lastRequestIdRef.current) return;

      setBuyers(
        (data ?? []).map((row) => ({
          ...row,
          // D1 returns ints (0/1) for booleans
          orangesPicked: Boolean(row.orangesPicked),
          orangesPaid: Boolean(row.orangesPaid),
          paidMethod: row.paidMethod ?? null,
        }))
      );
    } catch (error) {
      if (requestId !== lastRequestIdRef.current) return;
      setLoadError(error);
    } finally {
      if (requestId === lastRequestIdRef.current) setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameFilter]);

  const buyersById = useMemo(() => {
    const map = new Map();
    for (const buyer of buyers) map.set(buyer.id, buyer);
    return map;
  }, [buyers]);

  async function addBuyer(partial) {
    const created = await createBuyer({
      buyerName: partial.buyerName ?? "",
      bagsOfTen: Number(partial.bagsOfTen ?? 0),
      bagsOfTwenty: Number(partial.bagsOfTwenty ?? 0),
      orangesPicked: false,
      orangesPaid: false,
    });

    // simplest: refetch (keeps multi-editor consistent)
    await refresh();
    return created.id;
  }

  async function updateBuyer(buyerId, patch) {
    // light optimistic update for snappy UX
    setBuyers((previous) =>
      previous.map((buyer) => (buyer.id === buyerId ? { ...buyer, ...patch } : buyer))
    );

    try {
      await patchBuyer(buyerId, patch);
      await refresh();
    } catch (error) {
      // rollback by refetching
      await refresh();
      throw error;
    }
  }

  async function removeBuyer(buyerId) {
    // optimistic remove
    setBuyers((previous) => previous.filter((buyer) => buyer.id !== buyerId));

    try {
      await deleteBuyer(buyerId);
      await refresh();
    } catch (error) {
      await refresh();
      throw error;
    }
  }

  async function clearAllBuyers() {
    setBuyers([]);

    try {
      await deleteAllBuyers();
      await refresh();
    } catch (error) {
      await refresh();
      throw error;
    }
  }

  return {
    buyers,
    buyersById,
    addBuyer,
    updateBuyer,
    removeBuyer,
    clearAllBuyers,
    refresh,
    isLoading,
    loadError,
  };
}
