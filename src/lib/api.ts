import type { ConciergeRequest, Local, LocalReview, Place, PlaceReview, Roadmap, ConsultationBooking } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) throw new Error(`PlanRupee API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export interface BootstrapData {
  places: Place[];
  locals: Local[];
  placeReviews: PlaceReview[];
  localReviews: LocalReview[];
  activeRoadmap: Roadmap | null;
  myConsultations: ConsultationBooking[];
  myConciergeRequests: ConciergeRequest[];
  savedPlaceIds: string[];
  savedLocalIds: string[];
}

export const api = {
  bootstrap: () => request<BootstrapData>('/bootstrap'),
  save: (kind: 'place' | 'local', id: string) => request<string[]>(`/saved/${kind}/${id}`, { method: 'PUT' }),
  roadmap: (roadmap: Roadmap) => request<Roadmap>('/roadmap', { method: 'PUT', body: JSON.stringify(roadmap) }),
  consultation: (booking: ConsultationBooking) => request<ConsultationBooking>('/consultations', { method: 'POST', body: JSON.stringify(booking) }),
  concierge: (item: ConciergeRequest) => request<ConciergeRequest>('/concierge', { method: 'POST', body: JSON.stringify(item) }),
  conciergeUpdate: (id: string, update: Partial<ConciergeRequest>) => request<ConciergeRequest>(`/concierge/${id}`, { method: 'PATCH', body: JSON.stringify(update) }),
  placeReview: (review: PlaceReview) => request<PlaceReview>('/reviews/place', { method: 'POST', body: JSON.stringify(review) }),
  localReview: (review: LocalReview) => request<LocalReview>('/reviews/local', { method: 'POST', body: JSON.stringify(review) }),
  place: (place: Place) => request<Place>('/places', { method: 'POST', body: JSON.stringify(place) }),
  placeUpdate: (id: string, update: Partial<Place>) => request<Place>(`/places/${id}`, { method: 'PATCH', body: JSON.stringify(update) }),
  localUpdate: (id: string, update: Partial<Local>) => request<Local>(`/locals/${id}`, { method: 'PATCH', body: JSON.stringify(update) })
};
