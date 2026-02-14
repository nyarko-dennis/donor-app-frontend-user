import { useQuery, useMutation } from "@tanstack/react-query";
import {
    fetchCampaigns,
    fetchConstituencies,
    fetchSubConstituencies,
    fetchDonationCauses,
    initiateDonation,
} from "@/lib/api";

export function useCampaigns() {
    return useQuery({
        queryKey: ["campaigns"],
        queryFn: fetchCampaigns,
    });
}

export function useConstituencies() {
    return useQuery({
        queryKey: ["constituencies"],
        queryFn: fetchConstituencies,
    });
}

export function useDonationCauses() {
    return useQuery({
        queryKey: ["donation-causes"],
        queryFn: fetchDonationCauses,
    });
}

export function useSubConstituencies(constituencyId: string | undefined) {
    return useQuery({
        queryKey: ["sub-constituencies", constituencyId],
        queryFn: () => fetchSubConstituencies(constituencyId!),
        enabled: !!constituencyId,
    });
}

export function useInitiateDonation() {
    return useMutation({
        mutationFn: initiateDonation,
    });
}
