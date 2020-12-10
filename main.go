package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "os"
    "math"
    "sync"
)

type Info struct {
    Province     string      `json:"province"`
    Data    []Case    `json:"data"`
}

type Case struct {
    Date              string      `json:"date"`
    Change_cases      int         `json:"change_cases"`
    Change_fatal      int         `json:"change_fatalities"`
    Change_tests      int         `json:"change_tests"`
    Change_hosp       int         `json:"change_hospitalizations"`
    Change_crit       int         `json:"change_criticals"`
    Change_recov      int         `json:"change_recoveries"`
    Total_cases       int         `json:"total_cases"`
    Total_fatal       int         `json:"total_fatalities"`
    Total_tests       int         `json:"total_tests"`
    Total_hosp        int         `json:"total_hospitalizations"`
    Total_crit        int         `json:"total_criticals"`
    Total_recov       int         `json:"total_recoveries"`
}

type Output struct {
    Dates  []string
    Cases  []int
    Fatal  []int
    Cases_ma  []int
    Fatal_ma  []int
    Cases_ma30  []int
    Fatal_ma30  []int
}

type Combprov struct {
    Dates  []string
    Ont Provout
    Que Provout
    Bc Provout
    Ab Provout
    Man Provout
}

type Provout struct {
    Cases100  []int
    Cases  []int
    Fatal  []int
    Hosp   []int
    Crit   []int
}

type Death struct {
    Country string      `json:"country"`
    Smkrate float64     `json:"smokingrate"`
    Cases float64           `json:"cases"`
    D100k float64       `json:"death100k"`
    Age float64             `json:"medage"`
}

type Deathout struct {
    Country  []string
    Cases  []float64
    Smk  []float64
    D100k   []float64
    Age   []float64
    XYsmk []XY
    XYage []XY
    Smkcorr float64
    Agecorr float64
}

// for scatterplot
type XY struct {
    X float64   `json:"x"`
    Y float64   `json:"y"`
}

// calculate day moving average of array
func sum_div(array []int, day int) int {  
 result := 0  
 for _, v := range array {  
  result += v  
 }  
 return (result/day)
}

// return provout of province data given url and population
func Prov_data(url string, popul int) Provout{
    resp, err := http.Get(url)
    if err != nil {
        log.Fatal(err)
    }

    body, _ := ioutil.ReadAll(resp.Body)
    
    var f Info
    err = json.Unmarshal(body, &f)
    if err != nil {
        fmt.Println("didnt work")
    }
    
    var m Provout
    
    for _, x := range f.Data {
        m.Cases100 = append(m.Cases100, x.Change_cases/popul)
        m.Cases = append(m.Cases, x.Change_cases)
        m.Fatal = append(m.Fatal, x.Change_fatal)
        m.Hosp = append(m.Hosp, x.Total_hosp)
        m.Crit = append(m.Crit, x.Total_crit)
    }
    
    return m
}

// Simular to https://www.geeksforgeeks.org/program-find-correlation-coefficient/
// for calculating correlation coefficient
func Correlation(x []float64, y[]float64, n int) float64 {
    
    sum_X := float64(0)
    sum_Y := float64(0)
    sum_XY := float64(0)
    squareSum_X := float64(0)
    squareSum_Y := float64(0)
    j := float64(n)
    
    i := 0
    for i < n {
        // Sum of x
        sum_X += x[i]
        
        // Sum of y
        sum_Y += y[i]
        
        // Sum of xy
        sum_XY = sum_XY + (x[i] * y[i])
        
        // Sum of y and y squared
        squareSum_X = squareSum_X + (x[i] * x[i])
        squareSum_Y = squareSum_Y + (y[i] * y[i])
        
        i += 1
        }
    corr := (j * sum_XY - sum_X * sum_Y)/
       (math.Sqrt((j * squareSum_X - 
       sum_X * sum_X)* (j * squareSum_Y - 
       sum_Y * sum_Y)))
       
    return corr
}

func main() {
    // canada data
    url := "https://api.covid19tracker.ca/reports?fill_dates&stat&date&after&before"

    resp, err := http.Get(url)
    if err != nil {
        log.Fatal(err)
    }

    body, _ := ioutil.ReadAll(resp.Body)

    var f Info
    err = json.Unmarshal(body, &f)
    if err != nil {
        fmt.Println("didnt work")
    }

    var m Output

    // Calculations for national data
    for count, x := range f.Data {
        m.Dates = append(m.Dates, x.Date)
        m.Cases = append(m.Cases, x.Change_cases)
        m.Fatal = append(m.Fatal, x.Change_fatal)
        if count < 7 {
            m.Cases_ma = append(m.Cases_ma, x.Change_cases)
            m.Fatal_ma = append(m.Fatal_ma, x.Change_fatal)
        } else {
            m.Cases_ma = append(m.Cases_ma, sum_div(m.Cases[count-7:count], 7))
            m.Fatal_ma = append(m.Fatal_ma, sum_div(m.Fatal[count-7:count], 7))
        }

        if count < 30 {
            m.Cases_ma30 = append(m.Cases_ma30, x.Change_cases)
            m.Fatal_ma30 = append(m.Fatal_ma30, x.Change_fatal)
        } else {
            m.Cases_ma30 = append(m.Cases_ma30, sum_div(m.Cases[count-30:count], 30))
            m.Fatal_ma30 = append(m.Fatal_ma30, sum_div(m.Fatal[count-30:count], 30))
        }
    }
    
    file, _ := json.MarshalIndent(m, "", " ")
    _ = ioutil.WriteFile("data/data.json", file, 0644)
    
    var finalprov Combprov
    finalprov.Dates = m.Dates
    
    // Data for Ontario
    url = "https://api.covid19tracker.ca/reports/province/on?fill_dates&stat&date&after&before"
    finalprov.Ont = Prov_data(url, 134)
    
    // Data for Quebec
    url = "https://api.covid19tracker.ca/reports/province/qc?fill_dates&stat&date&after&before"
    finalprov.Que = Prov_data(url, 81)
    
    // Data for BC
    url = "https://api.covid19tracker.ca/reports/province/bc?fill_dates&stat&date&after&before"
    finalprov.Bc = Prov_data(url, 46)
    
    // Data for Alberta
    url = "https://api.covid19tracker.ca/reports/province/ab?fill_dates&stat&date&after&before"
    finalprov.Ab = Prov_data(url, 40)
    
    // Data for Manitoba
    url = "https://api.covid19tracker.ca/reports/province/mb?fill_dates&stat&date&after&before"
    finalprov.Man = Prov_data(url, 12)
    
    file1, _ := json.MarshalIndent(finalprov, "", " ")
    _ = ioutil.WriteFile("data/prov.json", file1, 0644)
    
    // Reading local static file
    jsonfile, err := os.Open("deathdata.json")
    if err != nil {
        log.Fatal(err)
    }
    defer jsonfile.Close()
    
    body, _ = ioutil.ReadAll(jsonfile)
    
    var darray []Death
    
    err = json.Unmarshal(body, &darray)
    if err != nil {
        fmt.Println("didnt work")
    }
    
    var n Deathout
    
    // store country, cases, % of country that smokes, deaths per 100,000, ave age of country
    for _, x := range darray {
        n.Country = append(n.Country, x.Country)
        n.Cases = append(n.Cases, x.Cases)
        n.Smk = append(n.Smk, x.Smkrate)
        n.D100k = append(n.D100k, x.D100k)
        n.Age = append(n.Age, x.Age)
    }
//    fmt.Println(darray)

    var ans float64
    var ans1 float64
    var waitgroup sync.WaitGroup
    
    // calculate correlations concurrently
    waitgroup.Add(1)
    go func() {
        ans = Correlation(n.Smk, n.D100k, len(n.D100k))
        waitgroup.Done()
    }()
    
    waitgroup.Add(1)
    go func() {
        ans1 = Correlation(n.Age, n.D100k, len(n.D100k))
        waitgroup.Done()
    }()
    
    waitgroup.Wait()
//    fmt.Println(ans)
//    fmt.Println(ans1)

    n.Smkcorr = ans
    n.Agecorr = ans1
    
    // generate x,y coordinates for scatterplot
    i := 0
    for i < len(n.D100k) {
        n.XYsmk = append(n.XYsmk, XY{X: n.D100k[i], Y: n.Smk[i] })
        n.XYage = append(n.XYage, XY{X: n.D100k[i], Y: n.Age[i] })
        i += 1
    }
    
    file2, _ := json.MarshalIndent(n, "", " ")
    _ = ioutil.WriteFile("data/deathcorr.json", file2, 0644)

}