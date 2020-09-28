import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

import Slider from "@material-ui/core/Slider";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const muiTheme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

const FileDropzoneWrapper = styled.div`
    margin: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Area = styled.div`
    width: 80%;
    height: 80%;
    border: #2979ff dashed 2px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
`;

function App() {
    const [file, setFile] = useState<File[] | undefined>(undefined);

    if (file == null) {
        return (
            <FileDropzoneWrapper>
                <FileDropzone onDrop={(f) => setFile(f)} />
            </FileDropzoneWrapper>
        );
    }

    return <Trimmer onDelete={() => setFile(undefined)} file={file[0]} />;
}

function FileDropzone(props: { onDrop: (f: File[]) => void }) {
    const onDrop = useCallback((f) => props.onDrop(f), []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <Area {...getRootProps()}>
            <input {...getInputProps()} />
            ここに動画ファイルをドロップするか、
            <br />
            クリックして動画を選択してください
        </Area>
    );
}

const TrimmerWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const SliderWrapper = styled.div`
    width: 75%;
`;

type TrimmerProps = {
    onDelete: () => void;
    file: File;
};

type TrimmerState = {
    videoLength: number; // sec
    videoCurrentPos: number;
    sliderRange: number[];
    outputFilename: string;
};

class Trimmer extends React.Component<TrimmerProps, TrimmerState> {
    private videoRef: React.RefObject<HTMLVideoElement>;
    private videoUrl: string;

    constructor(props: TrimmerProps) {
        super(props);

        this.videoUrl = window.URL.createObjectURL(this.props.file);
        this.videoRef = React.createRef();
        this.state = {
            videoLength: 0,
            videoCurrentPos: 0,
            sliderRange: [0, 0],
            outputFilename: ""
        };
    }

    componentDidMount() {
        if (this.videoRef.current == null) {
            return;
        }

        this.videoRef.current.onloadedmetadata = (e) => {
            // @ts-ignore
            const duration = e.target.duration;
            console.log("got", duration);

            this.setState({
                videoLength: duration,
                sliderRange: [
                    Math.ceil(duration / 4),
                    Math.ceil((duration / 4) * 3),
                ],
            });
        };

        this.videoRef.current.ontimeupdate = (e) => {
            this.setState({
                // @ts-ignore
                videoCurrentPos: e.target.currentTime,
            });
        };

        this.videoRef.current.load();
    }

    componentWillUnmount() {
        window.URL.revokeObjectURL(this.videoUrl);
    }

    render() {
        const marks = [
            { value: this.state.videoCurrentPos, label: "現在位置" },
        ];

        return (
            <TrimmerWrapper>
                <ThemeProvider theme={muiTheme}>
                    <video
                        controls
                        src={this.videoUrl}
                        ref={this.videoRef}
                        style={{ width: "80%", margin: 20 }}
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

                    <TextField 
                        label="出力ファイル名"
                        onChange={(e) => this.setState({ outputFilename: e.target.value })}
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
                </ThemeProvider>
            </TrimmerWrapper>
        );
    }
}

const FFmpegCommandWrapper = styled.div`
    background-color: #202020;
    border-radius: 5px;
    color: white;
    width: 80%;
    user-select: all;
    padding: 10px;
    margin: 5px;
    text-align: center;
`;

type FFmpegCommandProps = {
    beginTime: number;
    endTime: number;
    file: File;
    videoCodec: string;
    audioCodec: string;
    crf: number;
    outputFilename: string;
};

function FFmpegCommand(props: FFmpegCommandProps) {
    const text = `ffmpeg -ss ${props.beginTime} -to ${props.endTime} -i "${props.file.name}" -c:v ${props.videoCodec} -c:a ${props.audioCodec} -crf ${props.crf} "${props.outputFilename}"`;

    return <FFmpegCommandWrapper>{text}</FFmpegCommandWrapper>;
}

export default App;
