import { CityForm } from "@/components/cities/CityForm";

export const metadata = { title: "Tilføj by — Japan Tur" };

export default function NewCityPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <CityForm />
    </div>
  );
}
