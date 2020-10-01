import React from "react";
import styled from "styled-components";

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

export type FFmpegCommandProps = {
    beginTime: number;
    endTime: number;
    file: File;
    videoCodec: string;
    audioCodec: string;
    crf: number;
    outputFilename: string;
};

export function FFmpegCommand(props: FFmpegCommandProps) {
    const text = `ffmpeg -ss ${props.beginTime} -to ${props.endTime} -i "${props.file.name}" -c:v ${props.videoCodec} -c:a ${props.audioCodec} -crf ${props.crf} "${props.outputFilename}"`;

    return <FFmpegCommandWrapper>{text}</FFmpegCommandWrapper>;
}
