
const staticColorObj = {
    tableColor: {
        ["--table-currow-color"]: {
            daybreakBlue: "rgba(24, 144, 255, 0.5)",
            dustRed: "rgba(255, 77, 79,0.5)",
            dark: "rgba(48, 49, 51,0.5)",
            sunsetOrange: "rgba(250, 140, 22,0.5)",
            polarGreen: "rgba(82, 196, 26,0.5)",
            cyan: "rgba(19, 194, 194,0.5)",
            sunriseYellow: "rgba(250, 219, 20,0.5)",
            goldenPurple: "rgba(114, 46, 209,0.5)",
            magenta: "rgba(235, 47, 150,0.5)",
            gray: "rgba(116, 125, 140,0.5)",
        },
        ["--table-footer-color"]: {
            daybreakBlue: "rgba(24, 144, 255, 0.4)",
            dustRed: "rgba(255, 77, 79,0.4)",
            dark: "rgba(48, 49, 51,0.4)",
            sunsetOrange: "rgba(250, 140, 22,0.4)",
            polarGreen: "rgba(82, 196, 26,0.4)",
            cyan: "rgba(19, 194, 194,0.4)",
            sunriseYellow: "rgba(250, 219, 20,0.4)",
            goldenPurple: "rgba(114, 46, 209,0.4)",
            magenta: "rgba(235, 47, 150,0.4)",
            gray: "rgba(116, 125, 140,0.4)",
        },
    },

    buttonColor: {
        ["--button-group-background"]: {
            daybreakBlue: "rgba(24, 144, 255, 0.3)",
            dustRed: "rgba(255, 77, 79,0.3)",
            dark: "rgba(48, 49, 51,0.3)",
            sunsetOrange: "rgba(250, 140, 22,0.3)",
            polarGreen: "rgba(82, 196, 26,0.3)",
            cyan: "rgba(19, 194, 194,0.3)",
            sunriseYellow: "rgba(250, 219, 20,0.3)",
            goldenPurple: "rgba(114, 46, 209,0.3)",
            magenta: "rgba(235, 47, 150,0.3)",
            gray: "rgba(116, 125, 140,0.3)",
        },
        ["--button-background"]: {
            daybreakBlue: "rgba(24, 144, 255, 0)",
            dustRed: "rgba(255, 77, 79,0)",
            dark: "rgba(48, 49, 51,0)",
            sunsetOrange: "rgba(250, 140, 22,0)",
            polarGreen: "rgba(82, 196, 26,0)",
            cyan: "rgba(19, 194, 194,0)",
            sunriseYellow: "rgba(250, 219, 20,0)",
            goldenPurple: "rgba(114, 46, 209,0)",
            magenta: "rgba(235, 47, 150,0)",
            gray: "rgba(116, 125, 140,0)",
        },
        ["--button-disabled-background"]: {
            daybreakBlue: "rgba(24, 144, 255, 0)",
            dustRed: "rgba(255, 77, 79,0)",
            dark: "rgba(48, 49, 51,0)",
            sunsetOrange: "rgba(250, 140, 22,0)",
            polarGreen: "rgba(82, 196, 26,0)",
            cyan: "rgba(19, 194, 194,0)",
            sunriseYellow: "rgba(250, 219, 20,0)",
            goldenPurple: "rgba(114, 46, 209,0)",
            magenta: "rgba(235, 47, 150,0)",
            gray: "rgba(116, 125, 140,0)",
        },
        ["--button-hover-background"]: {
            daybreakBlue: "rgba(24, 144, 255, 1)",
            dustRed: "rgba(255, 77, 79,1)",
            dark: "rgba(48, 49, 51,1)",
            sunsetOrange: "rgba(250, 140, 22,1)",
            polarGreen: "rgba(82, 196, 26,1)",
            cyan: "rgba(19, 194, 194,1)",
            sunriseYellow: "rgba(250, 219, 20,1)",
            goldenPurple: "rgba(114, 46, 209,1)",
            magenta: "rgba(235, 47, 150,1)",
            gray: "rgba(116, 125, 140,1)",
        },
        ["--button-hover-disabled-background"]: {
            daybreakBlue: "rgba(24, 144, 255, 0)",
            dustRed: "rgba(255, 77, 79,0)",
            dark: "rgba(48, 49, 51,0)",
            sunsetOrange: "rgba(250, 140, 22,0)",
            polarGreen: "rgba(82, 196, 26,0)",
            cyan: "rgba(19, 194, 194,0)",
            sunriseYellow: "rgba(250, 219, 20,0)",
            goldenPurple: "rgba(114, 46, 209,0)",
            magenta: "rgba(235, 47, 150,0)",
            gray: "rgba(116, 125, 140,0)",
        },
    },

    systemColor: {
        ["--system-head-color"]: {
            daybreakBlue: "rgba(24, 144, 255, 0.7)",
            dustRed: "rgba(255, 77, 79,0.7)",
            dark: "rgba(48, 49, 51,0.7)",
            sunsetOrange: "rgba(250, 140, 22,0.7)",
            polarGreen: "rgba(82, 196, 26,0.7)",
            cyan: "rgba(19, 194, 194,0.7)",
            sunriseYellow: "rgba(250, 219, 20,0.7)",
            goldenPurple: "rgba(114, 46, 209,0.7)",
            magenta: "rgba(235, 47, 150,0.7)",
            gray: "rgba(116, 125, 140,0.7)",
        },
        ["--menu-hover-background"]: {
            daybreakBlue: "rgba(24, 144, 255, 0.5)",
            dustRed: "rgba(255, 77, 79,0.5)",
            dark: "rgba(48, 49, 51,0.5)",
            sunsetOrange: "rgba(250, 140, 22,0.5)",
            polarGreen: "rgba(82, 196, 26,0.5)",
            cyan: "rgba(19, 194, 194,0.5)",
            sunriseYellow: "rgba(250, 219, 20,0.5)",
            goldenPurple: "rgba(114, 46, 209,0.5)",
            magenta: "rgba(235, 47, 150,0.5)",
            gray: "rgba(116, 125, 140,0.5)",
        }
    },
};
class colorSystem {
    changeSystemColor(theme: string = "daybreakBlue") {//
        let root = document.documentElement;//
        for (const obj of Object.values(staticColorObj)) {
            Object.entries(obj).forEach(([key, value]: any) => {
                let color = value[theme];
                root.style.setProperty(key, color);
            });
        }
    }
}

export const color = new colorSystem();
