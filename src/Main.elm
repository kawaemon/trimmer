module Main exposing (main)

import Browser
import File exposing (File)
import Html exposing (Html, button, div, p, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick, preventDefaultOn)
import Json.Decode as JsonDecode


main =
    Browser.sandbox { init = init, update = update, view = view }


type alias Model =
    { hover : Bool
    , files : List File
    }


init : Model
init =
    Model False []


type Msg
    = SetHover Bool
    | GotFile (List File)


update : Msg -> Model -> Model
update msg model =
    case msg of
        SetHover t ->
            { model | hover = t }

        GotFile f ->
            { model | hover = False, files = f }


view : Model -> Html Msg
view model =
    div
        [ style "width" "100%"
        , style "height" "100vh"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "center"
        , on "dragenter" (SetHover True)
        , on "dragover" (SetHover True)
        , on "dragleave" (SetHover False)
        , onCustom "drop" droppedFileDecoder
        ]
        [ div
            [ style "width" "40%"
            , style "height" "40%"
            , style "border" "2px black dotted"
            , style "display" "flex"
            , style "align-items" "center"
            , style "justify-content" "center"
            ]
            [-- text (Debug.toString model)
            ]
        ]


on : String -> Msg -> Html.Attribute Msg
on eventName msg =
    onCustom eventName (JsonDecode.succeed msg)


onCustom : String -> JsonDecode.Decoder Msg -> Html.Attribute Msg
onCustom eventName decoder =
    preventDefaultOn eventName (JsonDecode.map (\x -> ( x, True )) decoder)


droppedFileDecoder : JsonDecode.Decoder Msg
droppedFileDecoder =
    JsonDecode.at [ "dataTransfer", "files" ] (JsonDecode.oneOrMore (((<<) << (<<)) GotFile (::)) File.decoder)
