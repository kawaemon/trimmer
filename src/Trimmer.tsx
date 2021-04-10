import React from "react";
import styled from "styled-components";
import Slider from "@material-ui/core/Slider";
import * as path from "path";

import { FFmpegCommand } from "./FFmpegCommand";
import { OsuFileNameInput } from "./OsuFileNameInput";
import { PathInput } from "./PathInput";

const TrimmerWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 75%;
`;

const Video = styled.video`
    width: 100%;
`;

export type TrimmerProps = {
    file: File;
    onResetFile: (f: File) => void;
};

type TrimmerState = {
    videoLength: number; // sec
    videoCurrentPos: number;
    sliderRange: number[];
    outputFilename: string;
    inputPath: string;
    outputPath: string;
};

export class Trimmer extends React.Component<TrimmerProps, TrimmerState> {
    private videoRef: React.RefObject<HTMLVideoElement>;
    private videoUrl: { url: string; src: File };

    constructor(props: TrimmerProps) {
        super(props);

        this.onVideoLoad = this.onVideoLoad.bind(this);

        this.videoUrl = {
            url: window.URL.createObjectURL(this.props.file),
            src: this.props.file,
        };

        this.videoRef = React.createRef();
        this.state = {
            videoLength: 0,
            videoCurrentPos: 0,
            sliderRange: [0, 0],
            outputFilename: "",
            inputPath: "",
            outputPath: "",
        };
    }

    onVideoLoad(e: React.SyntheticEvent<HTMLVideoElement, Event>) {
        const duration = e.currentTarget.duration;

        this.setState({
            videoLength: duration,
            sliderRange: [
                Math.ceil(duration / 4),
                Math.ceil((duration / 4) * 3),
            ],
        });
    }

    componentWillUnmount() {
        window.URL.revokeObjectURL(this.videoUrl.url);
    }

    render() {
        const marks = [
            { value: this.state.videoCurrentPos, label: "現在位置" },
        ];

        const onFileDrop = (e: React.DragEvent) => {
            e.preventDefault();

            if (e.dataTransfer.items) {
                const item = e.dataTransfer.items[0];

                if (item.kind === "file") {
                    const file = item.getAsFile();

                    if (file == null) {
                        throw new Error("unexpected null on file drag");
                    }

                    this.props.onResetFile(file);
                }

                return;
            }

            this.props.onResetFile(e.dataTransfer.files[0]);
        };

        if (this.props.file !== this.videoUrl.src) {
            window.URL.revokeObjectURL(this.videoUrl.url);
            this.videoUrl.url = window.URL.createObjectURL(this.props.file);
            this.videoUrl.src = this.props.file;
        }

        return (
            <TrimmerWrapper>
                <Video
                    controls
                    src={this.videoUrl.url}
                    ref={this.videoRef}
                    onLoadedMetadata={(e) => this.onVideoLoad(e)}
                    onTimeUpdate={(e) => {
                        this.setState({
                            videoCurrentPos: e.currentTarget.currentTime,
                        });
                    }}
                    onDrop={(e) => onFileDrop(e)}
                    onDragOver={(e) => e.preventDefault()}
                />
                <Slider
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    max={this.state.videoLength}
                    value={this.state.sliderRange}
                    marks={marks}
                    onChange={(_, v) =>
                        this.setState({ sliderRange: v as number[] })
                    }
                />
                <OsuFileNameInput
                    onChange={(e) => this.setState({ outputFilename: e })}
                />
                <PathInput
                    onChange={(e) =>
                        this.setState({
                            inputPath: e.inputPath,
                            outputPath: e.outputPath,
                        })
                    }
                />
                <FFmpegCommand
                    beginTime={this.state.sliderRange[0]}
                    endTime={this.state.sliderRange[1]}
                    videoCodec="libx265"
                    audioCodec="libmp3lame"
                    audioBitrate={192}
                    crf={18}
                    inputFilename={path.join(
                        this.state.inputPath,
                        this.props.file.name
                    )}
                    outputFilename={path.join(
                        this.state.outputPath,
                        this.state.outputFilename
                    )}
                />
            </TrimmerWrapper>
        );
    }
}
