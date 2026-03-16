import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  eventRelationService,
  type EventRelationInput,
} from "../services/eventRelationsService";

export const useUpsertEventRelation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EventRelationInput }) =>
      eventRelationService.upsertEventRelation(id, data),

    onSuccess: () => {
      toast.success("Event added to Favorites");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useDeleteEventRelation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      eventRelationService.deleteEventRelation(id),

    onSuccess: () => {
      toast.success("Event removed from Favorites");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
