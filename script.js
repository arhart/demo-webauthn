'use strict';
const el = function( tagName, children ) {
  const $el = document.createElement( tagName );
  if ( typeof children === 'string' ) {
    children = [ children ];
  }
  if ( $el instanceof Node && children && children.length ) {
    for ( const i of children ) {
      if ( typeof i === 'string' ) {
        $el.appendChild( document.createTextNode( i ) );
      } else if ( i instanceof Node ) {
        $el.appendChild( i );
      }
    }
  }
  return $el;
};
for( const tagName of [ 'button', 'p', 'table', 'td', 'th', 'tr' ] ) {
  el[tagName] = (children) => el( tagName, children );
}
const b = document.querySelector('body');
const table = el.table( [ el.tr( [
  el.th( 'Name' ),
  el.th( 'Value' )
] ) ] );
for(let i of [
    'isSecureContext',
    ['navigator', 'credentials', 'create'],
    ['navigator', 'credentials', 'get'],
    'PublicKeyCredential',
  ]) {
  i = Array.isArray( i ) ? i : [ i ];
  let val = window;
  for ( const component of i ) {
    val = val?.[ component ];
  }
  const tr = el.tr( [
    el.td( i.join('.') ),
    el.td( String( val ) )
  ] );
  table.appendChild( tr );
}
b.appendChild( table );

let buttonClickProcessing = false;
const button = el.button('hi');
button.addEventListener('click', async (event) => {
  try {
    if ( buttonClickProcessing ) {
      return;
    }
    const publicKey = {
      rp: {
        name: 'relyingParty name',
        // id: domain of current document, or a suffix thereof
        // icon
      },
      user: {
        displayName: 'Some One',
        // icon:
        id: new Uint8Array(8), // TODO need this? // really needs to be... something that uniquely identifies the user???
        name: 'someone@example.com', // TODO need this?
      },
      challenge: new Uint8Array(16), // really needs to be random and come from the server
      pubKeyCredParams: [
        // TODO how should this list be determined?
        // https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/pubKeyCredParams suggests ES256 (-7) and RS256 (-257) but then provides an example with -7 (ES256) and -37 (PS256)
        { type: 'public-key', alg: -7 }, // ES256 = -7
      ],
      attestation: 'none', // one of ['none', 'indirect', 'direct']
    };
    console.log('about to ask');
    const credentialPromise = navigator.credentials.create( { publicKey } );
    console.log('about to await');
    const credential = await credentialPromise;
    console.log('credential', credential);
    buttonClickProcessing = true;
  } finally {
    buttonClickProcessing = false;
  }
});
b.appendChild( button );
