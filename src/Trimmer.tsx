import React from "react";
import styled from "styled-components";
import Slider from "@material-ui/core/Slider";

import { FFmpegCommand } from "./FFmpegCommand";
import { OsuFileNameInput } from "./OsuFileNameInput";

const TrimmerWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const SliderWrapper = styled.div`
    width: 75%;
`;

const Video = styled.video`
    width: 80%;
    margin: 20px;
`;

export type TrimmerProps = {
    onDelete: () => void;
    file: File;
    onResetFile: (f: File) => void;
};

type TrimmerState = {
    videoLength: number; // sec
    videoCurrentPos: number;
    sliderRange: number[];
    outputFilename: string;
};

export class Trimmer extends React.Component<TrimmerProps, TrimmerState> {
    private videoRef: React.RefObject<HTMLVideoElement>;
    private videoUrl: { url: string; src: File };

    constructor(props: TrimmerProps) {
        console.info("New Trimmer");
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
            console.log("Recreating video url");

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

                <SliderWrapper>
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
                </SliderWrapper>

                <OsuFileNameInput
                    onChange={(e) => this.setState({ outputFilename: e })}
                />

                <FFmpegCommand
                    beginTime={this.state.sliderRange[0]}
                    endTime={this.state.sliderRange[1]}
                    file={this.props.file}
                    videoCodec="libx265"
                    audioCodec="aac"
                    crf={18}
                    outputFilename={this.state.outputFilename}
                />
            </TrimmerWrapper>
        );
    }
}
