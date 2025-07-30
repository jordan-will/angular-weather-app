import { Observable, from } from 'rxjs';

export const geolocation = (): Observable<{ lat: number; long: number }> => {
  return from(
    new Promise<{ lat: number; long: number }>((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              long: position.coords.longitude
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
            reject(error);
          }
        );
      } else {
        console.warn("Geolocation not available");
        reject(new Error("Geolocation not supported"));
      }
    })
  );
};
