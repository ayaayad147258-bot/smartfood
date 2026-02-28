import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface RestaurantTheme {
    primaryColor: string;
    secondaryColor: string;
}

export interface RestaurantData {
    name: string;
    logo: string;
    active: boolean;
    theme: RestaurantTheme;
}

type RestaurantState =
    | { status: 'loading' }
    | { status: 'found'; data: RestaurantData }
    | { status: 'not_found' }
    | { status: 'error'; message: string };

export function useRestaurant(restaurantId: string | undefined): RestaurantState {
    const [state, setState] = useState<RestaurantState>({ status: 'loading' });

    useEffect(() => {
        if (!restaurantId) {
            setState({ status: 'not_found' });
            return;
        }

        setState({ status: 'loading' });

        // Helper to process document data
        const processData = (snapData: any) => {
            if (!snapData.active) return null;
            return {
                name: snapData.name || 'مطعمنا',
                logo: snapData.logo || '',
                active: true,
                theme: {
                    primaryColor: snapData.theme?.primaryColor || '#e63946',
                    secondaryColor: snapData.theme?.secondaryColor || '#ffd700',
                },
            };
        };

        // Normalization function for soft matching
        const normalize = (text: string) => text.toLowerCase().replace(/[\s-]/g, '');

        // 1. Try fetching by Document ID first (Fastest)
        getDoc(doc(db, 'restaurants', restaurantId))
            .then(async (snap) => {
                if (snap.exists()) {
                    const fullData = processData(snap.data());
                    if (fullData) {
                        setState({ status: 'found', data: fullData });
                        return;
                    }
                }

                // 2. If not found by ID, try a "soft match" by fetching all active restaurants
                // and comparing normalized names. 
                // Note: This is an efficient fallback for a multi-tenant system with a reasonable 
                // number of restaurants (under 1000).
                const q = query(
                    collection(db, 'restaurants'),
                    where('active', '==', true)
                );
                const querySnapshot = await getDocs(q);

                const targetSlug = normalize(restaurantId);
                const match = querySnapshot.docs.find(doc => {
                    const data = doc.data();
                    const nameEn = data.name_en || '';
                    const nameAr = data.name || '';
                    return normalize(nameEn) === targetSlug || normalize(nameAr) === targetSlug;
                });

                if (match) {
                    const fullData = processData(match.data());
                    if (fullData) {
                        setState({ status: 'found', data: fullData });
                        return;
                    }
                }

                setState({ status: 'not_found' });
            })
            .catch((err) => {
                console.error('useRestaurant error:', err);
                setState({ status: 'error', message: err.message });
            });
    }, [restaurantId]);

    return state;
}
