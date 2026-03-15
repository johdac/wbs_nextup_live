import { useQueryClient, useMutation } from "@tanstack/react-query";
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
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
