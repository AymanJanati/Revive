import { partnerRepository } from "@/lib/repositories/partnerRepository";
import type { PartnerProfile } from "@/types/revive";

export class PartnerService {
  listPartners(): PartnerProfile[] {
    return partnerRepository.listAll();
  }
}

export const partnerService = new PartnerService();

