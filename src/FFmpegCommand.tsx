import React from "react";
import styled from "styled-components";

const FFmpegCommandWrapper = styled.div`
    background-color: #202020;
    border-radius: 5px;
    color: white;
    width: 80%;
    user-select: all;
    padding: 10px;
    margin: 20px;
    text-align: center;
`;

export type FFmpegCommandProps = {
    beginTime: number;
    endTime: number;
    inputFilename: string;
    videoCodec: string;
    audioCodec: string;
    audioBitrate: number;
    crf: number;
    outputFilename: string;
};

export function FFmpegCommand(props: FFmpegCommandProps) {
    const text = `ffmpeg -ss ${props.beginTime} -to ${props.endTime} -i "${props.inputFilename}" -c:v ${props.videoCodec} -c:a ${props.audioCodec} -b:a ${props.audioBitrate} -crf ${props.crf} "${props.outputFilename}" && rm "${props.inputFilename}"`;

    return <FFmpegCommandWrapper>{text}</FFmpegCommandWrapper>;
}
