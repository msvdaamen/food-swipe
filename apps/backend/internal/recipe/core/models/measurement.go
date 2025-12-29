package models

type Measurement struct {
	ID           int16
	Name         string
	Abbreviation string
}

type CreateMeasurement struct {
	Name         string
	Abbreviation string
}

type UpdateMeasurement struct {
	Name         string
	Abbreviation string
}
