package i18n

import (
	"github.com/go-playground/locales/en"
	"github.com/go-playground/locales/nl"
	ut "github.com/go-playground/universal-translator"
)

type Provider struct {
	translater *ut.UniversalTranslator
}

func New() *Provider {
	e := en.New()
	return &Provider{
		translater: ut.New(
			e,
			e,
			nl.New(),
		),
	}
}

func (p *Provider) GetTranslator(locale string) (trans ut.Translator, found bool) {
	return p.translater.GetTranslator(locale)
}
