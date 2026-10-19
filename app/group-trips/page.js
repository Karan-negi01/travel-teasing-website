import { redirect } from 'next/navigation';

// Group departures live on the packages page under the "groups" category.
export default function GroupTripsRedirect() {
  redirect('/packages?category=groups');
}
