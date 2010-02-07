#!/usr/bin/perl -w

use HTTP::Request::Common;
use LWP::UserAgent;
use JSON;


$HTTP_SERVER         = 'http://192.168.1.6/ldc';
$RPC_PATH            = '/server/';

sub send_json
{
    my ($filename, $json) = @_;
    print "\n[$filename]\n ==> $json\n";
    my $ua = LWP::UserAgent->new;
    $ret = $ua->request(POST "$HTTP_SERVER"."$RPC_PATH"."$filename", [json   => $json ]);
    if ($ret->is_success) {
	print "<== ".$ret->content."\n";
	return $ret->content;
    }
    print STDERR $ret->status_line, "\n";
}


sub read_json
{
    my ($filename) = @_;
    open(my $fh, '<', $filename) or die ($!);
    local $/ = undef;
    my $json = <$fh>;
    close($fh);
    return $json;
}



###############################################################################
# OPERAIONS
###############################################################################

# add
my $json = read_json('add_operation.json');
my $json_rcv = send_json 'add_operation.php', $json;


# del
$json_rcv = send_json 'del_operation.php', $json_rcv;


exit 0;



