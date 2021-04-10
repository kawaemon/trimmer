import React from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

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

const MessageContainer = styled.div`
    width: 70%;
    text-align: center;
    word-break: keep-all;
`;

export function FileDropzone(props: { onDrop: (f: File) => void }) {
    const onDrop = React.useCallback((f) => props.onDrop(f[0]), [props]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <Area {...getRootProps()}>
            <input {...getInputProps()} />
            <MessageContainer>
                ここに動画ファイルをドロップするか、クリックして動画を選択してください
            </MessageContainer>
        </Area>
    );
}
