const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Required for ngrok free tier
};

export async function fetchCampaigns() {
    const response = await fetch(`${API_BASE_URL}/api/campaigns`, {
        headers: defaultHeaders,
    });
    if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
    }
    return response.json();
}

export async function fetchDonationCauses() {
    const response = await fetch(`${API_BASE_URL}/api/donation-causes?take=20`, {
        headers: defaultHeaders,
    });
    if (!response.ok) {
        throw new Error("Failed to fetch donation causes");
    }
    return response.json();
}

export async function fetchConstituencies() {
    const response = await fetch(`${API_BASE_URL}/api/constituencies`, {
        headers: defaultHeaders,
    });
    if (!response.ok) {
        throw new Error("Failed to fetch constituencies");
    }
    return response.json();
}

export async function fetchSubConstituencies(constituencyId: string) {
    const response = await fetch(
        `${API_BASE_URL}/api/constituencies/${constituencyId}/sub-constituencies`,
        { headers: defaultHeaders }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch sub-constituencies");
    }
    return response.json();
}

export async function initiateDonation(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/donations/initiate`, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || "Failed to initiate donation");
    }
    return response.json();
}
