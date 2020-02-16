import React from "react";
import "./App.css";
import {
    Container,
    InputGroup,
    Row,
    FormControl,
    Spinner,
    Button,
    ProgressBar
} from "react-bootstrap";
import Chessboard from "chessboardjsx";
import html2canvas from "html2canvas";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: ""
        };
        this.windowUpdateDimensions = this.windowUpdateDimensions.bind(this);
    }
    windowUpdateDimensions = () => {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth
        });
    };
    componentDidMount = () => {
        window.addEventListener("resize", this.windowUpdateDimensions);
    };

    getFENString = base64Object => {
        var keys = Object.keys(base64Object);
        var square = 0;
        var fenString = "";
        var noSoldier = "rRnNbBqQkK";
        var all = "rRnNbBqQkKpP";
        var dots = 0;
        for (var i = 0; i < keys.length; i++) {
            var currKey = keys[i];
            var piece;
            if (base64Object[currKey]) {
                var sum = base64Object[currKey];

                if (square < 8 || square > 55) {
                    if (dots) {
                        piece =
                            dots.toString() + noSoldier[sum % noSoldier.length];
                    } else {
                        piece = noSoldier[sum % noSoldier.length];
                    }
                } else {
                    if (dots) {
                        piece = dots.toString() + all[sum % all.length];
                    } else {
                        piece = all[sum % all.length];
                    }
                }
                dots = 0;
            } else {
                dots += 1;
                piece = "";
            }

            if (square != 0 && (square + 1) % 8 == 0) {
                if (dots) {
                    fenString += dots.toString() + "/";
                    dots = 0;
                } else {
                    fenString += piece + "/";
                }
            } else {
                fenString += piece;
            }
            // if (square==63){
            //   if dots
            // }
            square += 1;
        }
        return fenString.slice(0, fenString.length - 1);
    };

    hashFunction = text => {
        var buff = new Buffer(text);
        var base64 = buff.toString("base64");
        var base64Object = {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            E: 0,
            F: 0,
            G: 0,
            H: 0,
            I: 0,
            J: 0,
            K: 0,
            L: 0,
            M: 0,
            N: 0,
            O: 0,
            P: 0,
            Q: 0,
            R: 0,
            S: 0,
            T: 0,
            U: 0,
            V: 0,
            W: 0,
            X: 0,
            Y: 0,
            Z: 0,
            a: 0,
            b: 0,
            c: 0,
            d: 0,
            e: 0,
            f: 0,
            g: 0,
            h: 0,
            i: 0,
            j: 0,
            k: 0,
            l: 0,
            m: 0,
            n: 0,
            o: 0,
            p: 0,
            q: 0,
            r: 0,
            s: 0,
            t: 0,
            u: 0,
            v: 0,
            w: 0,
            x: 0,
            y: 0,
            z: 0,
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            "+": 0,
            "/": 0
        };

        for (var i = 0; i < base64.length; i++) {
            var currLetter = base64[i];
            if (currLetter != "=") {
                base64Object[currLetter] += i + 1;
            }
        }
        console.log(base64);
        return this.getFENString(base64Object);
    };
    download = async e => {
        var myBoard = document.getElementsByClassName("chessBoard")[0];
        var myCanvas = await html2canvas(myBoard);
        var image = myCanvas
            .toDataURL("image/png", 1.0)
            .replace("image/png", "image/octet-stream");
        var download_link = document.getElementById("download");
        download_link.download = "ChessCyper.png";
        download_link.href = image;
        download_link.click();
    };
    textChanged = e => {
        var currText = e.target.value;
        if (currText == "") {
            this.setState({ board: "" });
        } else {
            this.setState({ board: this.hashFunction(currText) });
        }
        // console.log(this.hashFunction(currText));
    };
    render = () => {
        return (
            <Container style={{ width: this.state.width, overflowX: "hidden" }}>
                <Row className="text-center">
                    <Container className="text-center Header">
                        <h1>Naseer's Chess Cypher</h1>
                    </Container>
                </Row>
                <Row>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">
                                Input String
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            onChange={this.textChanged}
                        />
                    </InputGroup>
                </Row>
                <Row>
                    <Container className="chessBoard">
                        <Chessboard
                            position={this.state.board}
                            allowDrag={() => false}
                            draggable={false}
                            transitionDuration={0}
                        ></Chessboard>
                    </Container>
                </Row>
                <Row>
                    <Container className="chessBoard">
                        <Button
                            variant="outline-dark"
                            className="download"
                            size="lg"
                            onClick={this.download}
                        >
                            Download
                        </Button>
                    </Container>
                </Row>
            </Container>
        );
    };
}

export default Main;
