import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface RestaurantTheme {
    primaryColor: string;
    secondaryColor: string;
}

export interface RestaurantData {
    id?: string;
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

        const fetchRestaurant = async () => {
            setState({ status: 'loading' });
            try {
                // 1. Try finding by ID directly (legacy/technical IDs)
                const docRef = doc(db, 'restaurants', restaurantId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setState({
                        status: 'found',
                        data: {
                            id: docSnap.id,
                            name: data.name || 'مطعمنا',
                            logo: data.logo || '',
                            active: data.active ?? true,
                            theme: {
                                primaryColor: data.theme?.primaryColor || '#e63946',
                                secondaryColor: data.theme?.secondaryColor || '#ffd700',
                            },
                        }
                    });
                    return;
                }

                // 2. Try finding by SLUG field (modern/clean URLs)
                const q = query(collection(db, 'restaurants'), where('slug', '==', restaurantId));
                const querySnap = await getDocs(q);

                if (!querySnap.empty) {
                    const resDoc = querySnap.docs[0];
                    const data = resDoc.data();
                    setState({
                        status: 'found',
                        data: {
                            id: resDoc.id,
                            name: data.name || 'مطعمنا',
                            logo: data.logo || '',
                            active: data.active ?? true,
                            theme: {
                                primaryColor: data.theme?.primaryColor || '#e63946',
                                secondaryColor: data.theme?.secondaryColor || '#ffd700',
                            },
                        }
                    });
                    return;
                }

                setState({ status: 'not_found' });
            } catch (err: any) {
                console.error('Restaurant fetch error:', err);
                setState({ status: 'error', message: err.message || 'Error loading restaurant' });
            }
        };

        fetchRestaurant();
    }, [restaurantId]);

    return state;
}
