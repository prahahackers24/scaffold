import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CampaignClosed,
  CampaignCreated,
  DonationReceived
} from "../generated/DonationContract/DonationContract"

export function createCampaignClosedEvent(campaignId: BigInt): CampaignClosed {
  let campaignClosedEvent = changetype<CampaignClosed>(newMockEvent())

  campaignClosedEvent.parameters = new Array()

  campaignClosedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )

  return campaignClosedEvent
}

export function createCampaignCreatedEvent(
  campaignId: BigInt,
  campaignOwner: Address,
  campaignName: string
): CampaignCreated {
  let campaignCreatedEvent = changetype<CampaignCreated>(newMockEvent())

  campaignCreatedEvent.parameters = new Array()

  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignOwner",
      ethereum.Value.fromAddress(campaignOwner)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignName",
      ethereum.Value.fromString(campaignName)
    )
  )

  return campaignCreatedEvent
}

export function createDonationReceivedEvent(
  campaignId: BigInt,
  donor: Address,
  tokenAddresses: Array<Address>,
  tokenAmounts: Array<BigInt>
): DonationReceived {
  let donationReceivedEvent = changetype<DonationReceived>(newMockEvent())

  donationReceivedEvent.parameters = new Array()

  donationReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  donationReceivedEvent.parameters.push(
    new ethereum.EventParam("donor", ethereum.Value.fromAddress(donor))
  )
  donationReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddresses",
      ethereum.Value.fromAddressArray(tokenAddresses)
    )
  )
  donationReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAmounts",
      ethereum.Value.fromUnsignedBigIntArray(tokenAmounts)
    )
  )

  return donationReceivedEvent
}
