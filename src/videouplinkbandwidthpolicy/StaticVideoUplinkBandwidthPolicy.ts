// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import DefaultVideoAndEncodeParameter from '../videocaptureandencodeparameter/DefaultVideoCaptureAndEncodeParameter';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import ConnectionMetrics from './ConnectionMetrics';
import VideoUplinkBandwidthPolicy from './VideoUplinkBandwidthPolicy';

/** StaticVideoUplinkBandwidthPolicy implements capture and encode
 *  parameters that are nearly equivalent to those chosen by the
 *  traditional native clients. */
export default class StaticVideoUplinkBandwidthPolicy implements VideoUplinkBandwidthPolicy {
  private numParticipants: number = 0;
  private optimalParameters: DefaultVideoAndEncodeParameter;
  private parametersInEffect: DefaultVideoAndEncodeParameter;
  private idealMaxBandwidthKbps = 1400;

  constructor(private selfAttendeeId: string) {
    this.optimalParameters = new DefaultVideoAndEncodeParameter(0, 0, 0, 0, false);
    this.parametersInEffect = new DefaultVideoAndEncodeParameter(0, 0, 0, 0, false);
  }

  updateConnectionMetric(_metrics: ConnectionMetrics): void {
    return;
  }

  chooseMediaTrackConstraints(): MediaTrackConstraints {
    return {};
  }

  chooseEncodingParameters(): Map<string, RTCRtpEncodingParameters> {
    return new Map<string, RTCRtpEncodingParameters>();
  }

  updateIndex(videoIndex: VideoStreamIndex): void {
    // the +1 for self is assuming that we intend to send video, since
    // the context here is VideoUplinkBandwidthPolicy
    this.numParticipants =
      videoIndex.numberOfVideoPublishingParticipantsExcludingSelf(this.selfAttendeeId) + 1;
    this.optimalParameters = new DefaultVideoAndEncodeParameter(
      this.captureWidth(),
      this.captureHeight(),
      this.captureFrameRate(),
      this.maxBandwidthKbps(),
      false
    );
  }

  wantsResubscribe(): boolean {
    return !this.parametersInEffect.equal(this.optimalParameters);
  }

  chooseCaptureAndEncodeParameters(): DefaultVideoAndEncodeParameter {
    this.parametersInEffect = this.optimalParameters.clone();
    return this.parametersInEffect.clone();
  }

  private captureWidth(): number {
    let width = 640;
    if (this.numParticipants > 4) {
      width = 320;
    }
    return width;
  }

  private captureHeight(): number {
    let height = 384;
    if (this.numParticipants > 4) {
      height = 192;
    }
    return height;
  }

  private captureFrameRate(): number {
    return 15;
  }

  maxBandwidthKbps(): number {
    return this.idealMaxBandwidthKbps;
  }

  setIdealMaxBandwidthKbps(idealMaxBandwidthKbps: number): void {
    this.idealMaxBandwidthKbps = idealMaxBandwidthKbps;
  }

  setHasBandwidthPriority(hasBandwidthPriority: boolean): void {}
}
