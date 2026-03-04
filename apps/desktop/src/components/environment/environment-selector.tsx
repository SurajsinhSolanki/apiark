import { useEffect } from "react";
import { useEnvironmentStore } from "@/stores/environment-store";
import { useCollectionStore } from "@/stores/collection-store";

export function EnvironmentSelector() {
  const { environments, activeEnvironmentName, setActiveEnvironment, loadEnvironments } =
    useEnvironmentStore();
  const { collections } = useCollectionStore();

  // Load environments when collections change
  useEffect(() => {
    if (collections.length > 0) {
      const firstCollection = collections[0];
      if (firstCollection.type === "collection") {
        loadEnvironments(firstCollection.path);
      }
    }
  }, [collections, loadEnvironments]);

  if (environments.length === 0) {
    return (
      <p className="text-xs text-[#52525b]">
        No environments found
      </p>
    );
  }

  return (
    <select
      value={activeEnvironmentName ?? ""}
      onChange={(e) =>
        setActiveEnvironment(e.target.value || null)
      }
      className="w-full rounded bg-[#1c1c1f] px-2 py-1.5 text-xs text-[#e4e4e7] outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="">No Environment</option>
      {environments.map((env) => (
        <option key={env.name} value={env.name}>
          {env.name}
        </option>
      ))}
    </select>
  );
}
